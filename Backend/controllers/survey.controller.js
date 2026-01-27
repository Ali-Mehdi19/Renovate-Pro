import SurveyData from '../models/surveydata.models.js';
import crypto from 'crypto';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import triggerBlueprintGenerator from '../services/BlueprintTrigger.js';

const submitSurvey = async (req, res) => {
    try {
        const { apptid, siteLocation, rooms } = req.body;

        // 1. Generate SHA-256 Checksum for Data Integrity 
        const dataString = JSON.stringify({ apptid, rooms });
        const checksum = crypto.createHash('sha256').update(dataString).digest('hex');

        // 2. Create the Survey Record [cite: 45, 70]
        const newSurvey = new SurveyData({
            apptid,
            siteLocation,
            rooms,
            checksum // The digital "seal" 
        });

        await newSurvey.save();

        // 3. Trigger Blueprint Generation (Monolith Service Call)
        // Ensure this doesn't block the response, or await it if we want immediate feedback
        try {
            await triggerBlueprintGenerator(newSurvey._id);
        } catch (genError) {
            console.error("Blueprint generation failed but survey saved:", genError);
            // We don't fail the request, but log it. Blueprint status will remain pending/failed if we had that logic.
        }

        return res.status(201).json(
            new ApiResponse(201, "Survey submitted & processing started", newSurvey)
        );

    } catch (error) {
        console.error("Submit Survey Error:", error);
        if (error.errors) console.log("Validation Errors:", JSON.stringify(error.errors, null, 2));
        return res.status(500).json(
            new ApiError(500, "Survey not submitted something went wrong at survey submit", error)
        );
    }
};

const getSurveys = async (req, res) => {
    try {
        const surveys = await SurveyData.find().sort({ createdAt: -1 });
        return res.status(200).json(
            new ApiResponse(200, "Surveys fetched successfully", surveys)
        );
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to fetch surveys", error));
    }
};

const getSurveyById = async (req, res) => {
    try {
        const survey = await SurveyData.findById(req.params.id);
        if (!survey) {
            return res.status(404).json(new ApiError(404, "Survey not found"));
        }
        return res.status(200).json(
            new ApiResponse(200, "Survey fetched successfully", survey)
        );
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to fetch survey", error));
    }
};

export {
    submitSurvey,
    getSurveys,
    getSurveyById
};