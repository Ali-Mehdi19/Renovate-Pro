import express from 'express';
import { submitSurvey, getSurveys, getSurveyById } from '../controllers/survey.controller.js';

const router = express.Router();

router.post('/submit', submitSurvey);
router.get('/', getSurveys);
router.get('/:id', getSurveyById);

export default router;
