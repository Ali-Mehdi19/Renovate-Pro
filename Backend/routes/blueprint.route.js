import express from 'express';
import { generateBlueprint, getBlueprintByApptId } from '../controllers/blueprint.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Protected route to generate blueprint from a survey
router.route('/generate/:surveyId').post(verifyJWT, generateBlueprint);

router.route('/appointment/:apptId').get(verifyJWT, getBlueprintByApptId);

export default router;
