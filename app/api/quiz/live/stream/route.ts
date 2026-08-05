import { NextRequest } from "next/server";
import { getLiveState, setLiveState, generateQuestionToken, advanceToNextQuestion } from "@/lib/quizLiveEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") || `anon_${Math.random().toString(36).substring(2, 9)}`;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: any) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Controller might be closed
        }
      };

      // Send immediate connection ACK
      sendEvent("CONNECTED", { userId, timestamp: Date.now() });

      // Interval listener for SSE stream
      const interval = setInterval(async () => {
        try {
          const liveState = await getLiveState();

          if (!liveState) {
            sendEvent("IDLE_STATE", { status: "IDLE" });
            return;
          }

          const now = Date.now();
          const remainingMs = Math.max(0, liveState.endTime - now);
          const remainingSeconds = Math.ceil(remainingMs / 1000);

          // Expiry timestamp for HMAC token
          const tokenExpiry = liveState.endTime + 5000; // 5s beyond end time
          const hmacToken = generateQuestionToken(userId, liveState.questionId, tokenExpiry);

          // Zero-Leak Payload for participant stream (omit correctOptionIndex & explanation)
          const participantPayload = {
            questionId: liveState.questionId,
            topicId: liveState.topicId,
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
            isLocked: liveState.isLocked,
            autoPush: liveState.autoPush,
            allowSoloPlay: liveState.allowSoloPlay,
          };

          sendEvent("QUESTION_BROADCAST", participantPayload);

          // Auto-Push Trigger: When countdown hits 00:00, trigger 5s Intermission & Auto-Push Question #orderIndex+1
          if (remainingSeconds <= 0 && liveState.status === "ACTIVE") {
            if (liveState.autoPush) {
              await advanceToNextQuestion(liveState);
            } else {
              liveState.status = "EXPIRED";
              await setLiveState(liveState);
              sendEvent("QUESTION_EXPIRED", { questionId: liveState.questionId });
            }
          }
        } catch (err) {
          console.error("SSE stream error:", err);
        }
      }, 1000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        try {
          controller.close();
        } catch {
          // ignore
        }
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
