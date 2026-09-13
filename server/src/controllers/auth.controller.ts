import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";
import { AuthRequest } from "../types/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "skill_setu_super_secret_jwt_key_2026_secure";

function generateToken(user: { id: string; email: string; role: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name, role = "learner", targetTrackId } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, password, and name are required." });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role === "admin" ? "admin" : "learner",
        targetTrackId: targetTrackId || null,
        hasOnboarded: Boolean(targetTrackId)
      }
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "Account registered successfully.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        targetTrackId: user.targetTrackId,
        hasOnboarded: user.hasOnboarded
      }
    });
  } catch (err: any) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed", details: err.message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { targetTrack: true }
    });

    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        targetTrackId: user.targetTrackId,
        targetTrack: user.targetTrack,
        hasOnboarded: user.hasOnboarded,
        avatar: user.avatar
      }
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed", details: err.message });
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        targetTrack: {
          include: {
            requirements: {
              include: { skill: true }
            }
          }
        },
        skillProfiles: {
          include: { skill: true }
        }
      }
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch profile", details: err.message });
  }
}

export async function completeOnboarding(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { targetTrackId } = req.body;
    if (!targetTrackId) {
      res.status(400).json({ error: "targetTrackId is required." });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        targetTrackId,
        hasOnboarded: true
      },
      include: { targetTrack: true }
    });

    res.json({
      message: "Onboarding completed successfully",
      user: updated
    });
  } catch (err: any) {
    res.status(500).json({ error: "Onboarding failed", details: err.message });
  }
}

export async function switchDemo(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      include: { targetTrack: true }
    });

    if (!user) {
      res.status(404).json({ error: `Demo account '${email}' not found.` });
      return;
    }

    const token = generateToken(user);

    res.json({
      message: `Switched to demo account: ${user.name}`,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        targetTrackId: user.targetTrackId,
        targetTrack: user.targetTrack,
        hasOnboarded: user.hasOnboarded,
        avatar: user.avatar
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: "Demo switch failed", details: err.message });
  }
}

export async function listDemoAccounts(req: Request, res: Response): Promise<void> {
  try {
    const accounts = await prisma.user.findMany({
      where: {
        email: {
          in: ["learner@skillsetu.ai", "admin@skillsetu.ai", "analyst@skillsetu.ai"]
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        targetTrack: {
          select: { name: true }
        }
      }
    });

    res.json(accounts);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to list demo accounts" });
  }
}
