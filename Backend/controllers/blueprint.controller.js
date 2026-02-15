import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import SurveyData from '../models/surveydata.models.js';
import Blueprint from '../models/blueprint.models.js';
import { resolveVertices } from '../services/geometricCore.js';
import { generateCompleteBlueprint } from '../services/svgRenderer.js';

export const generateBlueprint = asyncHandler(async (req, res) => {
    const { surveyId } = req.params;

    if (!surveyId) {
        throw new ApiError(400, "Survey ID is required");
    }

    // 1. Fetch Request
    const survey = await SurveyData.findById(surveyId);
    if (!survey) {
        throw new ApiError(404, "Survey not found");
    }

    const rawWalls = survey.rooms;
    if (!rawWalls || rawWalls.length === 0) {
        throw new ApiError(400, "Survey has no room data to process");
    }

    // 2. Group Walls by Room Type
    // If room_type is mixed in the list, we assume sequential blocks or use lodash groupBy
    // Since we don't have a room ID, we'll group by "room_type". 
    // WARNING: If there are TWO "Bedroom"s, this will merge them. 
    // Ideally, the schema should have room_id. For now, we assume unique types or sequential distinct types.
    // Let's assume unique room_type for this MVP or use a reducing function that breaks on type change.

    // Simple Grouping by Type (Map key: room_type)
    const roomsMap = {};
    rawWalls.forEach(wall => {
        if (!roomsMap[wall.room_type]) {
            roomsMap[wall.room_type] = [];
        }
        roomsMap[wall.room_type].push(wall);
    });

    // 3. Process Each Room
    const processedRooms = [];

    try {
        for (const [roomType, walls] of Object.entries(roomsMap)) {
            const vertices = resolveVertices(walls);
            processedRooms.push({
                name: roomType,
                walls: walls,
                vertices: vertices
            });
        }
    } catch (error) {
        throw new ApiError(422, `Geometric processing failed: ${error.message}`);
    }

    // 4. SVG Rendering (Multi-Room)
    const svgContent = generateCompleteBlueprint(processedRooms);

    // 5. Save/Update Blueprint
    let blueprint = await Blueprint.findOne({ surveyid: surveyId });

    if (blueprint) {
        blueprint.svgData = svgContent;
        blueprint.status = 'Review Needed';
        blueprint.generatedAt = new Date();
        await blueprint.save();
    } else {
        blueprint = await Blueprint.create({
            surveyid: surveyId,
            plannerId: req.user._id,
            svgData: svgContent,
            status: 'Pending',
            dimensions: {
                width: 2000,
                height: 2000
            }
        });
    }

    return res
        .status(201)
        .json(new ApiResponse(201, "Blueprint generated successfully", blueprint));
});

export const getBlueprintByApptId = asyncHandler(async (req, res) => {
    const { apptId } = req.params;

    // 1. Find Survey for this Appointment
    const survey = await SurveyData.findOne({ apptid: apptId });
    if (!survey) {
        throw new ApiError(404, "No survey found for this appointment");
    }

    // 2. Find Blueprint for this Survey
    const blueprint = await Blueprint.findOne({ surveyid: survey._id });
    if (!blueprint) {
        throw new ApiError(404, "Blueprint not generated yet");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, blueprint, "Blueprint fetched successfully"));
});
