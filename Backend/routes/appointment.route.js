import express from 'express';
import {
    createAppointment,
    getMyAppointments,
    getSurveyorTasks,
    assignSurveyor,
    updateStatus,
    getAllAppointments
} from '../controllers/appointment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyJWT);

// Customer Routes
router.post('/book', createAppointment);
router.get('/my', getMyAppointments);

// Surveyor Routes
router.get('/tasks', getSurveyorTasks);

// Admin/Planner Routes
router.patch('/:id/assign', assignSurveyor);
router.get('/all', getAllAppointments);

// Shared/Updatable Routes
router.patch('/:id/status', updateStatus);

export default router;
