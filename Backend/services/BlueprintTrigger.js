// services/BlueprintTrigger.js
import { resolveVertices } from './geometricCore.js';
import { generateCompleteBlueprint } from './svgRenderer.js';
import Blueprint from '../models/blueprint.models.js';
import SurveyData from '../models/surveydata.models.js';

/**
 * Triggers the blueprint generation process synchronously (Monolith pattern).
 * @param {string} surveyId - The ID of the survey to process.
 */
export default async function triggerBlueprintGenerator(surveyId) {
    console.log(`[BlueprintTrigger] Starting generation for survey: ${surveyId}`);

    try {
        // 1. Fetch the raw survey data
        const survey = await SurveyData.findById(surveyId);
        if (!survey) {
            throw new Error(`Survey not found: ${surveyId}`);
        }

        const roomData = survey.rooms; // Assumes structure: [{ roomType, length_m, angle_deg, ... }]

        // 2. Execute Geometric Core Logic (Vector Loop Closure)
        // This is the CPU-intensive part. In a real microservice, this would happen elsewhere.
        const vertices = resolveVertices(roomData);

        // 3. Render the SVG with Dimension Lines
        const svgContent = generateCompleteBlueprint(vertices, roomData);

        // 4. Save the Blueprint
        const newBlueprint = new Blueprint({
            surveyid: survey._id, // Matches schema
            plannerId: null,
            svgData: svgContent,
            status: 'Pending',
            generatedAt: new Date()
        });

        await newBlueprint.save();
        console.log(`[BlueprintTrigger] Blueprint generated successfully: ${newBlueprint._id}`);

        return newBlueprint;

    } catch (err) {
        console.error("[BlueprintTrigger] Failed to generate blueprint:", err.message);
        throw err; // Re-throw to be caught by the controller
    }
}