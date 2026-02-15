import SurveyData from '../models/surveydata.models.js';
import crypto from 'crypto';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import triggerBlueprintGenerator from '../services/BlueprintTrigger.js';

const submitSurvey = asyncHandler(async (req, res) => {
    // 1. RBAC Check
    if (req.user.role !== 'Surveyor' && req.user.role !== 'Admin') {
        throw new ApiError(403, "Access denied: Only Surveyors can submit survey data");
    }

    const { apptid, siteLocation, rooms } = req.body;

    // 2. Input Validation
    if (!apptid) throw new ApiError(400, "Appointment ID is required");
    if (!siteLocation || !siteLocation.address || !siteLocation.coordinates) {
        throw new ApiError(400, "Valid site location (address & coordinates) is required");
    }
    if (!Array.isArray(rooms) || rooms.length === 0) {
        throw new ApiError(400, "At least one room measurement is required");
    }

    // 3. Generate SHA-256 Checksum for Data Integrity 
    const dataString = JSON.stringify({ apptid, rooms });
    const checksum = crypto.createHash('sha256').update(dataString).digest('hex');

    // 4. Create the Survey Record [cite: 45, 70]
    const newSurvey = await SurveyData.create({
        apptid,
        siteLocation,
        rooms,
        checksum // The digital "seal" 
    });

    const createdSurvey = await SurveyData.findById(newSurvey._id);

    if (!createdSurvey) {
        throw new ApiError(500, "Something went wrong while submitting the survey");
    }

    // 5. Trigger Blueprint Generation (Monolith Service Call)
    // Non-blocking call
    triggerBlueprintGenerator(createdSurvey._id).catch(err =>
        console.error(`Blueprint trigger failed for survey ${createdSurvey._id}:`, err)
    );

    return res.status(201).json(
        new ApiResponse(201, "Survey submitted successfully & processing started", createdSurvey)
    );
});

const getSurveys = asyncHandler(async (req, res) => {
    // RBAC: Only Planners and Admins should see all surveys
    if (req.user.role !== 'Planner' && req.user.role !== 'Admin') {
        throw new ApiError(403, "Access denied: Only Planners can view all surveys");
    }

    const surveys = await SurveyData.find().sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, "Surveys fetched successfully", surveys)
    );
});

const getSurveyById = asyncHandler(async (req, res) => {
    const survey = await SurveyData.findById(req.params.id);

    if (!survey) {
        throw new ApiError(404, "Survey not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Survey fetched successfully", survey)
    );
});

export {
    submitSurvey,
    getSurveys,
    getSurveyById
};