import { Router } from "express";
import { getAllTracks, getTrackById, getTrackCompetencies } from "../controllers/tracks.controller.js";

const router = Router();

router.get("/", getAllTracks);
router.get("/:id", getTrackById);
router.get("/:id/competencies", getTrackCompetencies);

export default router;
