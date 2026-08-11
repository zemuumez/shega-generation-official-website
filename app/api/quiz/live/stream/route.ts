import { NextRequest } from "next/server";
import {
  getLiveState,
  setLiveState,
  generateQuestionToken,
  advanceToNextQuestion,
  getAllowSoloPlay,
  getCurrentEpoch,
} from "@/lib/quizLiveEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") || `anon_${Math.random().toString(36).substring(2, 9)}`;
  const requestedTopicId = url.searchParams.get("topicId") || url.searchParams.get("quizId") || null;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: any) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          // controller closed
        }
      };

      sendEvent("CONNECTED", { userId, timestamp: Date.now() });

      const interval = setInterval(async () => {
        try {
          const liveState = await getLiveState();
          const epoch = await getCurrentEpoch();

          if (!liveState) {
            const allowSoloPlay = await getAllowSoloPlay();
            sendEvent("IDLE_STATE", { status: "IDLE", allowSoloPlay, epoch });
            return;
          }

          // Bug 1 Fix: Topic Isolation in SSE Stream — emit IDLE_STATE if live question is for a different topic
          const matchesTopic =
            !requestedTopicId ||
            requestedTopicId === "admin_deck" ||
            requestedTopicId === "all" ||
            liveState.topicId === requestedTopicId ||
            liveState.topicSlug === requestedTopicId;

          if (!matchesTopic) {
            const allowSoloPlay = await getAllowSoloPlay();
            sendEvent("IDLE_STATE", { status: "IDLE", allowSoloPlay, epoch });
            return;
          }

          const now = Date.now();
          const remainingMs = Math.max(0, liveState.endTime - now);
          const remainingSeconds = Math.ceil(remainingMs / 1000);
          const tokenExpiry = liveState.endTime + 5000;
          const hmacToken = generateQuestionToken(userId, liveState.questionId, tokenExpiry);

          const participantPayload = {
            questionId: liveState.questionId,
            topicId: liveState.topicId,
            topicSlug: liveState.topicSlug,
            questionText: liveState.questionText,
            questionType: liveState.questionType,
            codeSnippet: liveState.codeSnippet,
            options: liveState.options,
            difficulty: liveState.difficulty,
            points: liveState.points,
            orderIndex: liveState.orderIndex,
            timerDuration: liveState.timerDuration,
            remainingSeconds,
            token: hmacToken,
            tokenExpiry,
            status: liveState.status,
            startTime: liveState.startTime,
            endTime: liveState.endTime,
            epoch: liveState.epoch,
            isLocked: liveState.isLocked,
            autoPush: liveState.autoPush,
            allowSoloPlay: liveState.allowSoloPlay,
          };

          sendEvent("QUESTION_BROADCAST", participantPayload);

          if (remainingSeconds <= 0 && liveState.status === "ACTIVE") {
            if (liveState.autoPush) {
              await advanceToNextQuestion(liveState);
            } else {
              liveState.status = "EXPIRED";
              await setLiveState(liveState);
              sendEvent("QUESTION_EXPIRED", {
                questionId: liveState.questionId,
                topicId: liveState.topicId,
                topicSlug: liveState.topicSlug,
                epoch,
              });
            }
          }
        } catch (err) {
          console.error("SSE stream error:", err);
        }
      }, 1000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        try { controller.close(); } catch { /* ignore */ }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
