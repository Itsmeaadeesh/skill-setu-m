import { Router } from "express";
import { listTracks, getTrackById } from "../controllers/tracks.controller.js";

const router = Router();

router.get("/", listTracks);
router.get("/:id", getTrackById);

export default router;
