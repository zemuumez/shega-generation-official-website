# 🏆 Shega Generations - Live Challenge & Quiz Arena System Architecture

Welcome to the comprehensive architecture and operational guide for the **Shega Generations Live Challenge Arena & Quiz System**. This document details the core philosophy, system actors, technical features, data flow, and operational workflows of the platform.

---

## 📜 1. Executive Summary & Core Philosophy

The **Shega Generations Live Challenge Arena** is an interactive, real-time quiz and competitive platform designed to engage Ethiopian tech talents, software engineering students, and tech enthusiasts.

Unlike traditional static form quizzes, the Shega Arena provides a **real-time broadcast experience** similar to live esports competitions or interactive live trivia:
- **Live Operator Control**: An admin operator pushes questions live to all connected participant screens simultaneously.
- **Zero-Refresh Streaming**: Built using Server-Sent Events (SSE) for instant, low-latency broadcast updates without requiring manual browser refreshes.
- **Stateless & Scalable**: Powered by Upstash Redis and Next.js serverless functions, ensuring high resilience on Vercel deployments.
- **Zero-Leak Security**: Question answer keys are strictly protected on the backend using HMAC SHA-256 cryptographic tokens to prevent client-side inspection or network cheating.

---

## 👥 2. Actors in the System & Their Responsibilities

The Shega Challenge Arena defines four primary actors, each with distinct roles, interfaces, and permissions:

```
 +------------------------+             +------------------------+
 |   Live Operator (Admin)|             |  Student Participant   |
 | - Pushes Live Questions|             | - Joins Live Arena     |
 | - Configures Timers    |             | - Submits Answers      |
 | - Manages Queue Stack  |             | - Tracks Real-time Rank|
 +-----------+------------+             +-----------+------------+
             |                                      |
             v                                      v
 +---------------------------------------------------------------+
 |            Real-Time Engine (Upstash Redis & Memory)          |
 | - Live State (`quiz:live:active_state`)                       |
 | - Broadcast Queue (`quiz:live:question_queue`)               |
 | - Live Leaderboard (`quiz:live:leaderboard_entries`)         |
 +------------------------------- +------------------------------+
                                  |
                                  v
 +---------------------------------------------------------------+
 |              Sanity CMS Content & Persistence Layer           |
 | - Topics (`challengeTopic`) & Quizzes (`challengeQuiz`)       |
 | - Permanent Submission Logs (`challengeSubmission`)           |
 +---------------------------------------------------------------+
```

### 1️⃣ Actor 1: The Live Operator (Admin)
- **Role**: Event host and quiz director who manages the live flow of questions during events, workshops, or asynchronous competitions.
- **Interface**: `AdminQuizControlDeck` (`/challenges/admin` or integrated admin deck).
- **Security Barrier**: Protected by passcodes (`NEXT_PUBLIC_QUIZ_ADMIN_PASSCODE` / `shega-admin-2026`).
- **Key Capabilities**:
  - **Topic Filtering**: Selects specific technology domain categories (e.g., Ethiopian Tech History, Web Development, Data Structures).
  - **Live Question Push**: Pushes individual questions live to all connected student screens.
  - **Single Question Lock**: Stages questions into a **Live Broadcast Queue Stack** if an active countdown is currently running.
  - **Broadcast Controls**: Configures question timer durations (5s - 300s), toggles **Solo Play Mode**, and activates the **Auto-Push Automation Loop**.
  - **Session & Leaderboard Resets**: Resets active live sessions zero-refresh or clears leaderboard scores across Redis, memory, and Sanity CMS.
  - **Data Export**: Downloads live competition scores directly as CSV reports.

---

### 2️⃣ Actor 2: The Student Participant
- **Role**: Competitor who joins the challenge room to answer questions, earn points, and climb the live topic leaderboard.
- **Interface**: `MobileLiveQuizPage` (`/challenges/quiz/[topicSlug]`).
- **Profile Session**: 24-hour persistent registration stored in `localStorage` (`shega_quiz_participant`).
- **Key Capabilities**:
  - **Live Stage Player**: Views live broadcasting questions with syntax-highlighted code blocks, difficulty point tags, and dynamic ticking countdown meters.
  - **Touch-Optimized Option Cards**: Interactive letter buttons `( A )`, `( B )`, `( C )`, `( D )` with active ring glow and selected visual states.
  - **Dynamic Speed Bonus**: Earns base points (`EASY: 100 Pts`, `MEDIUM: 200 Pts`, `HARD: 400 Pts`) plus a speed bonus of `Remaining Seconds * 5 Pts` for fast correct answers.
  - **Live Topic Leaderboard**: Monitors live rankings with Top-3 Medal Badges (🥇 Gold, 🥈 Silver, 🥉 Bronze), accuracy percentages (`Acc %`), and highlighted personal rank.
  - **Sticky Performance Footer**: Displays continuous real-time personal rank, score, and accuracy at the bottom of the screen.

---

### 3️⃣ Actor 3: The Real-Time Engine (`quizLiveEngine`)
- **Role**: The core backend controller managing ephemeral live state, SSE broadcast streams, answer evaluation, and leaderboard storage.
- **Modules**: `lib/quizLiveEngine.ts`, `/api/quiz/live/stream`, `/api/quiz/live/control`, `/api/quiz/live/submit`, `/api/challenges/leaderboard`.
- **Key Capabilities**:
  - **State Persistence**: Uses Upstash Redis REST API (`UPSTASH_REDIS_REST_URL`) with an in-memory `globalThis` fallback for seamless state sharing across Vercel serverless functions.
  - **Zero-Flicker State Guarding**: Functional equality checks prevent redundant state updates and component blinking.
  - **HMAC SHA-256 Token Generation**: Verifies question submission window integrity and prevents replay attacks.

---

### 4️⃣ Actor 4: Sanity CMS Data Store
- **Role**: The primary content management source for topic definitions, quiz question sequences, and permanent historical records.
- **Schemas**:
  - `challengeTopic`: Topic domain titles, slugs, icons, and descriptions.
  - `challengeQuiz`: Quiz document containing structured question arrays, difficulty, points, code snippets, and correct option indices.
  - `challengeSubmission`: Permanent record logs created upon live answer submission.

---

## ⚡ 3. Key System Features & Technical Design

### 🚀 1. Real-Time Zero-Refresh SSE Broadcast
- **Endpoint**: `/api/quiz/live/stream`
- Utilizes HTTP Server-Sent Events (SSE) to maintain an open streaming connection to connected clients.
- Pushed questions are broadcast immediately as `QUESTION_BROADCAST` events, updating student screens zero-refresh within milliseconds.

### 🛡️ 2. Zero-Leak Security Architecture
- The SSE participant stream explicitly **omits** `correctOptionIndex` and `explanation` from the payload sent to clients.
- Students cannot inspect browser developer tools or network logs to discover the correct answer.
- Answer verification occurs exclusively on the backend inside `POST /api/quiz/live/submit` using HMAC token signatures.

### 🔒 3. Single Question Lock & Queue Stack
- To prevent accidental double-pushes during an active question countdown, the backend enforces a **Single Question Lock** (`status === "ACTIVE" && Date.now() < endTime`).
- If an operator clicks "Push" while a question is active, the system automatically stages the question into the **Broadcast Queue Stack**.
- Operators can click **"Push Next Queued Question"** or enable **Auto-Push Automation** to push queued questions sequentially.

### ⏱️ 4. Dynamic Speed Bonus Scoring System
Calculated on the server upon answer receipt:
$$\text{Total Points} = \text{Base Points} + (\text{Remaining Countdown Seconds} \times 5)$$

| Difficulty Level | Base Points | Speed Bonus Rate |
| :--- | :--- | :--- |
| **EASY** | 100 Pts | +5 Pts per second left |
| **MEDIUM** | 200 Pts | +5 Pts per second left |
| **HARD** | 400 Pts | +5 Pts per second left |

---

### 🔄 5. Full Refresh Persistence & Resiliency
All system settings are fully persistent across browser reloads:
- **Operator Side**: Topic filter selection, custom timer durations, solo play mode switch, auto-push toggle, and staged question queue stacks are saved to `localStorage` and synced to Redis.
- **Student Side**: Participant identity, current total score, answered state, and live topic rankings persist seamlessly across refreshes.

---

### 📊 6. Priority Leaderboard Merging
The leaderboard API (`GET /api/challenges/leaderboard`) merges real-time Redis entries with historical Sanity CMS submissions using a priority-preserving algorithm (`[...sanityEntries, ...liveEntries]`). Active live participant updates take highest priority, instantly reflecting live points earned.

---

## 🔄 4. End-to-End Event Lifecycle

```
[1. Admin Authenticates] -> [2. Selects Topic & Timer] -> [3. Pushes Question #1]
                                                                  |
                                                                  v
[6. Leaderboard Updates] <-- [5. Backend Evaluates Answer] <-- [4. Students Receive SSE & Submit]
         |
         v
[7. Operator Pushes Next / Auto-Push Loops] -> [8. Event Concludes & Export CSV]
```

1. **Initialization**: Admin logs into Control Deck (`shega-admin-2026`). Students register handles (e.g., `Kidus M. (@kidus_code)`).
2. **Broadcast Push**: Operator selects a question and clicks "Push Question".
3. **Live Stream**: Question appears instantly on all student screens with ticking timer and progress bar.
4. **Answer Submission**: Student chooses an option. Backend verifies HMAC token, checks option index, adds speed bonus, and updates Upstash Redis.
5. **Real-time Leaderboard Update**: User header score updates to `+230 Pts` and live rankings update on both Admin Deck and Student Leaderboard.
6. **Session Reset / Conclusion**: Operator exports CSV report or resets leaderboard for the next event session.

---

## 📁 5. Primary Codebase File Map

| File Path | Description |
| :--- | :--- |
| [`lib/quizLiveEngine.ts`](file:///Users/zemichaeltefera/Documents/GitHub/shega-generations/lib/quizLiveEngine.ts) | Core Redis live state engine, HMAC tokens, leaderboard store, and auto-advance logic. |
| [`components/AdminQuizControlDeck.tsx`](file:///Users/zemichaeltefera/Documents/GitHub/shega-generations/components/AdminQuizControlDeck.tsx) | Admin operator deck UI, topic filters, broadcast controls, queue stack, and reset modals. |
| [`app/challenges/quiz/[topicSlug]/page.tsx`](file:///Users/zemichaeltefera/Documents/GitHub/shega-generations/app/challenges/quiz/%5BtopicSlug%5D/page.tsx) | Redesigned Challenge Arena UI, live SSE listener, option buttons, sticky performance footer. |
| [`app/api/quiz/live/stream/route.ts`](file:///Users/zemichaeltefera/Documents/GitHub/shega-generations/app/api/quiz/live/stream/route.ts) | Server-Sent Events (SSE) zero-leak live streaming route handler. |
| [`app/api/quiz/live/control/route.ts`](file:///Users/zemichaeltefera/Documents/GitHub/shega-generations/app/api/quiz/live/control/route.ts) | Control API endpoint for question pushes, queue updates, config sync, and session resets. |
| [`app/api/quiz/live/submit/route.ts`](file:///Users/zemichaeltefera/Documents/GitHub/shega-generations/app/api/quiz/live/submit/route.ts) | Secure answer evaluation route with HMAC token check and Redis submission recording. |
| [`app/api/challenges/leaderboard/route.ts`](file:///Users/zemichaeltefera/Documents/GitHub/shega-generations/app/api/challenges/leaderboard/route.ts) | Dynamic leaderboard GET endpoint merging live Redis entries and Sanity CMS historical data. |
