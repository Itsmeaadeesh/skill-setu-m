import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "skill_setu_super_secret_jwt_key_2026_secure";

export const register = async (req, res) => {
  try {
    const { email, password, name, role = "LEARNER" } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name are required." });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role.toUpperCase(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
      },
      include: { track: true }
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        hasOnboarded: user.hasOnboarded,
        track: user.track
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Failed to register user." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { track: true }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        hasOnboarded: user.hasOnboarded,
        educationLevel: user.educationLevel,
        experienceYears: user.experienceYears,
        trackId: user.trackId,
        track: user.track
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login." });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        track: true,
        skillLevels: { include: { skill: true } },
        enrollments: { include: { course: true } },
        quizAttempts: { include: { quiz: true } }
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
};

export const completeOnboarding = async (req, res) => {
  try {
    const { trackId, educationLevel, experienceYears, targetRole } = req.body;

    if (!trackId) {
      return res.status(400).json({ error: "Please select a learning track." });
    }

    // Update user profile
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        trackId,
        educationLevel: educationLevel || "Undergraduate",
        experienceYears: parseFloat(experienceYears) || 0,
        targetRole: targetRole || "Junior Engineer",
        hasOnboarded: true
      },
      include: { track: true }
    });

    // Populate default baseline skill levels (Level 1) for all skills in this track framework if none exist
    const framework = await prisma.competencyFramework.findMany({
      where: { trackId }
    });

    for (const item of framework) {
      await prisma.userSkillLevel.upsert({
        where: {
          userId_skillId: {
            userId: req.user.id,
            skillId: item.skillId
          }
        },
        create: {
          userId: req.user.id,
          skillId: item.skillId,
          currentLevel: 1,
          source: "ONBOARDING_DEFAULT"
        },
        update: {}
      });
    }

    res.json({
      message: "Onboarding completed successfully",
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        hasOnboarded: updated.hasOnboarded,
        trackId: updated.trackId,
        track: updated.track
      }
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ error: "Failed to complete onboarding." });
  }
};

export const switchDemoAccount = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      include: { track: true }
    });

    if (!user) {
      return res.status(404).json({ error: `Demo account ${email} not found.` });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: `Switched to ${user.name} (${user.role})`,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        hasOnboarded: user.hasOnboarded,
        trackId: user.trackId,
        track: user.track
      }
    });
  } catch (error) {
    console.error("Switch demo error:", error);
    res.status(500).json({ error: "Failed to switch demo account." });
  }
};

export const listDemoAccounts = async (req, res) => {
  try {
    const accounts = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        track: { select: { name: true } }
      },
      take: 20
    });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: "Failed to list demo accounts." });
  }
};
