import "dotenv/config";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.model.js";
import Profile from "./models/Profile.model.js";
import Skill from "./models/Skill.model.js";
import Stats from "./models/Stats.model.js";
import Project from "./models/Project.model.js";

const seed = async () => {
  await connectDB();
  console.log(" Starting seed...\n");

  // 1. ADMIN

  const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (existingAdmin) {
    console.log("  Admin already exists, skipping.");
  } else {
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    console.log(` Admin created: ${process.env.ADMIN_EMAIL}`);
  }

  // 2. PROFILE

  const existingProfile = await Profile.findOne();
  if (existingProfile) {
    console.log("  Profile already exists, skipping.");
  } else {
    await Profile.create({
      name: "Raj",
      title: "Full Stack Developer",
      bio: "Passionate full-stack developer who loves building real-world projects — from e-commerce clones to AI-powered web apps.",
      about:
        "Hi, I'm Raj — a full-stack developer with hands-on experience building production-level web applications using React, Node.js, Express, and MongoDB. " +
        "I enjoy solving DSA problems on LeetCode and GeeksForGeeks, contributing to open-source, and exploring AI integrations. " +
        "When I'm not coding, I'm designing UIs in Figma or learning something new about web performance and scalability.",
      email: process.env.CONTACT_EMAIL || "raj@email.com",
      location: "India",
      social: {
        github: "https://github.com/byteRaj-commits",
        linkedin: "", // Add your LinkedIn URL here
        leetcode: "https://leetcode.com/u/Raj7753/",
        geeksforgeeks: "https://www.geeksforgeeks.org/profile/rajp18zsll",
        twitter: "",
      },
    });
    console.log(" Profile created (Raj).");
  }

  // 3. SKILLS

  const skillCount = await Skill.countDocuments();
  if (skillCount > 0) {
    console.log("  Skills already exist, skipping.");
  } else {
    const skills = [
      // ── Languages ──────────────────────────────────
      { name: "C", category: "languages", proficiency: 80, order: 1 },
      { name: "C++", category: "languages", proficiency: 82, order: 2 },
      { name: "Java", category: "languages", proficiency: 75, order: 3 },
      { name: "JavaScript", category: "languages", proficiency: 92, order: 4 },

      // ── Frontend ────────────────────────────────────
      { name: "HTML", category: "frontend", proficiency: 95, order: 1 },
      { name: "CSS", category: "frontend", proficiency: 90, order: 2 },
      { name: "React", category: "frontend", proficiency: 88, order: 3 },

      // ── Backend ─────────────────────────────────────
      { name: "Node.js", category: "backend", proficiency: 87, order: 1 },
      { name: "Express.js", category: "backend", proficiency: 85, order: 2 },

      // ── Database ────────────────────────────────────
      { name: "MongoDB", category: "database", proficiency: 83, order: 1 },

      // ── Tools ───────────────────────────────────────
      { name: "Figma", category: "tools", proficiency: 78, order: 1 },
      { name: "Git / GitHub", category: "tools", proficiency: 90, order: 2 },
      { name: "AI Prompting", category: "tools", proficiency: 85, order: 3 },
    ];

    await Skill.insertMany(skills);
    console.log(` ${skills.length} skills created.`);
  }

  // 4. PROJECTS  (6 real projects)

  const projectCount = await Project.countDocuments();
  if (projectCount > 0) {
    console.log("  Projects already exist, skipping.");
  } else {
    const projects = [
      // ── 1. YouTube Clone ──────────────────────────
      {
        title: "YouTube Clone",
        shortDescription:
          "A fully functional YouTube-like video platform with search, playback, and channel pages.",
        description:
          "A full-stack YouTube clone built with React and Node.js. Features include video upload and streaming, search and filter, channel pages, like/dislike, comment sections, subscription system, and JWT-based authentication. Uses Cloudinary for video and thumbnail storage.",
        techStack: [
          "React",
          "Node.js",
          "Express.js",
          "MongoDB",
          "Cloudinary",
          "JWT",
          "Multer",
        ],
        category: "fullstack",
        status: "in-progress",
        featured: true,
        liveUrl: "",
        githubUrl: "https://github.com/byteRaj-commits",
        order: 1,
      },

      // ── 2. Flipkart Clone ─────────────────────────
      {
        title: "Flipkart Clone",
        shortDescription:
          "A pixel-perfect Flipkart UI clone with product listing, cart, and checkout flow.",
        description:
          "A front-end clone of Flipkart built with React. Includes product listing pages, category filters, a fully functional cart with quantity management, order summary, and a responsive design that mirrors the real Flipkart experience. State managed with React hooks and Context API.",
        techStack: ["React", "JavaScript", "HTML", "CSS", "Context API"],
        category: "frontend",
        status: "completed",
        featured: true,
        liveUrl: "",
        githubUrl: "https://github.com/byteRaj-commits",
        order: 2,
      },

      // ── 3. Amazon Clone ───────────────────────────
      {
        title: "Amazon Clone",
        shortDescription:
          "Full-stack Amazon replica with product pages, cart, and user authentication.",
        description:
          "A full-stack Amazon clone with React on the frontend and Node.js/Express on the backend. Features include user registration and login with JWT, product listing and detail pages, add-to-cart functionality, order placement, and a basic admin panel to manage products.",
        techStack: ["React", "Node.js", "Express.js", "MongoDB", "JWT", "CSS"],
        category: "fullstack",
        status: "completed",
        featured: true,
        liveUrl: "",
        githubUrl: "https://github.com/byteRaj-commits",
        order: 3,
      },

      // ── 4. AI-Based Financial Website ─────────────
      {
        title: "AI-Based Financial Website",
        shortDescription:
          "Smart financial dashboard powered by AI for expense tracking and budget insights.",
        description:
          "An AI-integrated financial management platform that helps users track income and expenses, visualize spending patterns with charts, and receive AI-powered budget recommendations. Built with React for a dynamic dashboard UI, Node.js/Express for the API, MongoDB for data storage, and integrated with an AI API for intelligent financial insights and summaries.",
        techStack: [
          "React",
          "Node.js",
          "Express.js",
          "MongoDB",
          "AI API",
          "Chart.js",
          "JWT",
        ],
        category: "fullstack",
        status: "completed",
        featured: true,
        liveUrl: "",
        githubUrl: "https://github.com/byteRaj-commits",
        order: 4,
      },

      // ── 5. Project 5 (placeholder) ────────────────
      {
        title: "Dev Portfolio v1",
        shortDescription:
          "My personal portfolio website built with React showcasing projects and skills.",
        description:
          "A responsive personal portfolio website built from scratch using React. Includes an animated hero section, about me, skills grid, project cards with modals, a live contact form connected to the backend API, and a clean dark-mode design. Fully connected to a custom Node.js/Express/MongoDB backend.",
        techStack: ["React", "CSS", "Node.js", "Express.js", "MongoDB"],
        category: "fullstack",
        status: "completed",
        featured: false,
        liveUrl: "",
        githubUrl: "https://github.com/byteRaj-commits",
        order: 5,
      },

      // ── 6. Project 6 (placeholder) ────────────────
      {
        title: "Chat App",
        shortDescription:
          "Real-time chat application with rooms, private messaging, and online status.",
        description:
          "A real-time chat application supporting public rooms and private one-on-one messaging. Built with React on the frontend and Node.js/Express with Socket.io on the backend. Features include online/offline user indicators, message timestamps, read receipts, and JWT-secured user sessions. Messages are persisted in MongoDB.",
        techStack: [
          "React",
          "Node.js",
          "Express.js",
          "Socket.io",
          "MongoDB",
          "JWT",
        ],
        category: "fullstack",
        status: "completed",
        featured: false,
        liveUrl: "",
        githubUrl: "https://github.com/byteRaj-commits",
        order: 6,
      },
    ];

    await Project.insertMany(projects);
    console.log(` ${projects.length} projects created.`);
  }

  // 5. STATS  (Raj's real platform usernames + URLs)

  const statsCount = await Stats.countDocuments();
  if (statsCount > 0) {
    console.log("  Stats already exist, skipping.");
  } else {
    await Stats.insertMany([
      {
        platform: "leetcode",
        leetcode: {
          username: "Raj7753",
          totalSolved: 0, // Update via PUT /api/v1/stats/leetcode after going live
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          ranking: 0,
          totalQuestions: 0,
          acceptanceRate: 0,
          streak: 0,
          profileUrl: "https://leetcode.com/u/Raj7753/",
        },
      },
      {
        platform: "github",
        github: {
          username: "byteRaj-commits",
          publicRepos: 0, // Update via PUT /api/v1/stats/github after going live
          totalStars: 0,
          followers: 0,
          following: 0,
          totalCommits: 0,
          contributionStreak: 0,
          topLanguages: [],
          profileUrl: "https://github.com/byteRaj-commits",
          avatarUrl: "https://github.com/byteRaj-commits.png",
        },
      },
      {
        platform: "geeksforgeeks",
        geeksforgeeks: {
          username: "rajp18zsll",
          totalProblemsSolved: 0, // Update via PUT /api/v1/stats/geeksforgeeks after going live
          school: 0,
          basic: 0,
          easy: 0,
          medium: 0,
          hard: 0,
          codingScore: 0,
          instituteRank: 0,
          monthlyScore: 0,
          streak: 0,
          profileUrl: "https://www.geeksforgeeks.org/profile/rajp18zsll",
        },
      },
    ]);
    console.log(
      " Stats records created (update numbers via API after launch).",
    );
  }

  console.log("\n Seed complete! Server is ready to start.\n");
  console.log(" Next steps:");
  console.log("   1. npm run dev");
  console.log(
    "   2. Upload your avatar & resume via PUT /api/v1/profile (multipart/form-data)",
  );
  console.log("   3. Update live stats numbers via the Admin API endpoints");
  console.log("   4. Add your LinkedIn URL to profile social links\n");
  process.exit(0);
};

seed().catch((err) => {
  console.error(" Seed failed:", err);
  process.exit(1);
});
