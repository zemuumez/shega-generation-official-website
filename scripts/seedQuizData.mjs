import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

// Load .env variables
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf8");
    envFile.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join("=").trim();
        }
      }
    });
  }
} catch (e) {
  console.warn("Could not load .env file manually:", e);
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "g8zdm74i";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN in .env");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-06-01",
  useCdn: false,
});

// 1. Dummy Quiz Topics
const dummyTopics = [
  {
    _id: "topic-web-dev-algos",
    _type: "quizTopic",
    title: "Web Development & Algorithmic Speed",
    slug: { _type: "slug", current: "web-dev-algorithms" },
    description: "High-speed questions on React 19, Next.js App Router, CSS Container Queries, HTTP caching, and Data Structure complexities.",
    orderIndex: 1,
    isActive: true,
  },
  {
    _id: "topic-cybersecurity",
    _type: "quizTopic",
    title: "Cybersecurity & Cryptography",
    slug: { _type: "slug", current: "cybersecurity-crypto" },
    description: "Web security fundamentals, SQL injection defense, CORS/SOP policies, hashing algorithms, and Avalanche Effect.",
    orderIndex: 2,
    isActive: true,
  },
  {
    _id: "topic-ethiopian-tech",
    _type: "quizTopic",
    title: "Ethiopian Tech History & Shega Culture",
    slug: { _type: "slug", current: "ethiopian-tech-shega" },
    description: "Indigenous knowledge, Ethiopian computing pioneers, INSA & AI Institute milestones, and Shega values.",
    orderIndex: 3,
    isActive: true,
  },
];

// 2. Dummy Quizzes & Questions
const dummyQuizzes = [
  {
    _id: "quiz-web-dev-speed-run",
    _type: "challengeQuiz",
    title: "Web Development & Algorithmic Speed Run",
    slug: { _type: "slug", current: "web-dev-algorithmic-speed-run" },
    topic: { _type: "reference", _ref: "topic-web-dev-algos" },
    category: "Timed Q&A",
    difficulty: "MEDIUM",
    description: "Test your speed and mastery over modern Web Development, HTTP performance, and Big-O algorithm analysis.",
    timePerQuestion: 45,
    isPublished: true,
    isFeatured: true,
    questions: [
      {
        _key: "q1_web",
        questionText: "Which HTTP header is recommended for strict browser caching of immutable static assets in Next.js?",
        orderIndex: 1,
        questionType: "MULTIPLE_CHOICE",
        difficulty: "EASY",
        codeSnippet: `Cache-Control: public, max-age=31536000, immutable\nETag: "w/123456789"`,
        options: [
          "Cache-Control: no-store, no-cache",
          "Cache-Control: public, max-age=31536000, immutable",
          "Expires: 0",
          "Pragma: no-cache",
        ],
        correctOptionIndex: 1,
        explanation: "Combining public, max-age=31536000, immutable tells the browser and CDNs that the asset will never change.",
        points: 100,
      },
      {
        _key: "q2_web",
        questionText: "What is the primary architectural purpose of Server Actions in React 19 / Next.js App Router?",
        orderIndex: 2,
        questionType: "MULTIPLE_CHOICE",
        difficulty: "MEDIUM",
        codeSnippet: `"use server";\n\nexport async function submitForm(formData: FormData) {\n  // Executes securely on Node.js server\n}`,
        options: [
          "To run client-side event handlers in Web Workers",
          "To execute backend mutations directly without manual REST/GraphQL API boilerplate",
          "To replace CSS animation logic",
          "To force client components to render as static HTML only",
        ],
        correctOptionIndex: 1,
        explanation: "Server Actions allow asynchronous functions to execute securely on the server without manual REST boilerplate.",
        points: 200,
      },
      {
        _key: "q3_web",
        questionText: "CSS Container Queries style elements based on global viewport width instead of parent container size.",
        orderIndex: 3,
        questionType: "TRUE_FALSE",
        difficulty: "EASY",
        options: ["True", "False"],
        correctOptionIndex: 1,
        explanation: "False! Container queries style elements based on their immediate parent container size, NOT viewport width.",
        points: 100,
      },
      {
        _key: "q4_web",
        questionText: "What algorithm time complexity is achieved when accessing an element by key in a well-balanced Hash Table?",
        orderIndex: 4,
        questionType: "MULTIPLE_CHOICE",
        difficulty: "HARD",
        codeSnippet: `const userMap = new Map();\nuserMap.set("shega_user", { score: 950 });\nconst data = userMap.get("shega_user");`,
        options: ["O(N)", "O(log N)", "O(1) average time", "O(N^2)"],
        correctOptionIndex: 2,
        explanation: "Hash tables achieve O(1) constant average time for key lookups.",
        points: 400,
      },
    ],
  },
  {
    _id: "quiz-cybersecurity-fundamentals",
    _type: "challengeQuiz",
    title: "Cybersecurity & Cryptographic Logic Challenge",
    slug: { _type: "slug", current: "cybersecurity-cryptographic-logic" },
    topic: { _type: "reference", _ref: "topic-cybersecurity" },
    category: "Timed Q&A",
    difficulty: "HARD",
    description: "A fast-paced test on web vulnerability defense, hashing properties, and same-origin security policies.",
    timePerQuestion: 45,
    isPublished: true,
    isFeatured: true,
    questions: [
      {
        _key: "q1_sec",
        questionText: "Which cryptographic property ensures that changing a single bit in input drastically alters output hash?",
        orderIndex: 1,
        questionType: "MULTIPLE_CHOICE",
        difficulty: "MEDIUM",
        options: [
          "Symmetric encryption",
          "The Avalanche Effect",
          "Public key distribution",
          "Linear feedback",
        ],
        correctOptionIndex: 1,
        explanation: "The Avalanche Effect ensures a tiny change in input yields a completely different, unpredictable output hash.",
        points: 200,
      },
      {
        _key: "q2_sec",
        questionText: "How can SQL Injection (SQLi) vulnerabilities be fundamentally prevented in web backend applications?",
        orderIndex: 2,
        questionType: "MULTIPLE_CHOICE",
        difficulty: "MEDIUM",
        codeSnippet: `// VULNERABLE:\ndb.query(\`SELECT * FROM users WHERE name = '\${userInput}'\`);`,
        options: [
          "By converting input strings to uppercase",
          "By using parameterized queries / prepared statements instead of string concatenation",
          "By hiding the database password in client JS",
          "By using HTTP GET instead of POST",
        ],
        correctOptionIndex: 1,
        explanation: "Prepared statements parameterize query values separately from SQL commands, preventing code injection.",
        points: 200,
      },
      {
        _key: "q3_sec",
        questionText: "The Same-Origin Policy (SOP) allows any website script to freely read data from another domain without restrictions.",
        orderIndex: 3,
        questionType: "TRUE_FALSE",
        difficulty: "HARD",
        options: ["True", "False"],
        correctOptionIndex: 1,
        explanation: "False! SOP blocks scripts on one origin from reading sensitive resource data from another origin.",
        points: 400,
      },
    ],
  },
  {
    _id: "quiz-ethiopian-tech-shega",
    _type: "challengeQuiz",
    title: "Ethiopian Tech History & Shega Generation Culture",
    slug: { _type: "slug", current: "ethiopian-tech-history-shega-culture" },
    topic: { _type: "reference", _ref: "topic-ethiopian-tech" },
    category: "Timed Q&A",
    difficulty: "EASY",
    description: "Questions celebrating Ethiopian tech pioneers, INSA & AI Institute milestones, and Shega values.",
    timePerQuestion: 45,
    isPublished: true,
    isFeatured: true,
    questions: [
      {
        _key: "q1_eth",
        questionText: "What does 'ሸጋ' (Shega) translate to in Amharic in the context of Shega Generation?",
        orderIndex: 1,
        questionType: "MULTIPLE_CHOICE",
        difficulty: "EASY",
        options: [
          "Fast & Rapid",
          "Excellent, Beautiful, and Full of Virtue/Quality",
          "High Mountain Peak",
          "Secret Code",
        ],
        correctOptionIndex: 1,
        explanation: "In Ethiopian culture, 'ሸጋ' (Shega) signifies excellence, beauty, goodness, and virtue.",
        points: 100,
      },
      {
        _key: "q2_eth",
        questionText: "Shega Generation provides free computer science and AI education to talented Ethiopian youth.",
        orderIndex: 2,
        questionType: "TRUE_FALSE",
        difficulty: "EASY",
        options: ["True", "False"],
        correctOptionIndex: 0,
        explanation: "True! Shega Generation nurtures tech geniuses and indigenous leadership across Ethiopia.",
        points: 100,
      },
    ],
  },
];

async function main() {
  console.log("🚀 Starting dummy quiz topics and questions seeding to Sanity CMS...");

  // 1. Create Topics
  for (const topic of dummyTopics) {
    try {
      await client.createOrReplace(topic);
      console.log(`✅ Uploaded Topic: "${topic.title}" (${topic._id})`);
    } catch (err) {
      console.error(`❌ Failed to upload topic "${topic.title}":`, err);
    }
  }

  // 2. Create Quizzes
  for (const quiz of dummyQuizzes) {
    try {
      await client.createOrReplace(quiz);
      console.log(`✅ Uploaded Quiz: "${quiz.title}" (${quiz._id}) with ${quiz.questions.length} questions`);
    } catch (err) {
      console.error(`❌ Failed to upload quiz "${quiz.title}":`, err);
    }
  }

  console.log("🎉 Seeding completed successfully! All topics and questions are live in Sanity Studio.");
}

main().catch((err) => {
  console.error("Fatal error during seeding:", err);
  process.exit(1);
});
