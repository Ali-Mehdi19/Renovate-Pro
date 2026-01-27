import SurveyData from '../models/surveydata.models';
import crypto from 'crypto';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

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

        // 3. Trigger Blueprint Generation (Microservice Call) [cite: 43, 79]
        // This is where your Node.js heavy computation service takes over.
        await triggerBlueprintGenerator(newSurvey._id);

        return new ApiResponse(201, "Survey submitted & processing started", newSurvey)
        
    } catch (error) {
        new ApiError(400, "Survey not submitted something went wrong at survey submit", error)
    }
};

export {
    submitSurvey
}