import express from 'express';
import { getAllBlueprints, getBlueprintById, updateBlueprintStatus } from '../controllers/planner.controller.js';

const router = express.Router();

router.get('/', getAllBlueprints);
router.get('/:id', getBlueprintById);
router.patch('/:id/status', updateBlueprintStatus);

export default router;
