import express from 'express';
import { submitSurvey, getSurveys, getSurveyById } from '../controllers/survey.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyJWT); // Apply authentication to all routes

router.route('/submit').post(submitSurvey);
router.route('/').get(getSurveys);
router.route('/:id').get(getSurveyById);

export default router;
