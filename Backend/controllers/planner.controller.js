import Blueprint from '../models/blueprint.models.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// Get all blueprints
const getAllBlueprints = async (req, res) => {
    try {
        const blueprints = await Blueprint.find().populate('surveyid').sort({ createdAt: -1 });
        return res.status(200).json(
            new ApiResponse(200, "Blueprints fetched successfully", blueprints)
        );
    } catch (error) {
        console.error("Get All Blueprints Error:", error);
        return res.status(500).json(new ApiError(500, "Failed to fetch blueprints", error));
    }
};

// Get blueprint by ID (returns SVG data)
const getBlueprintById = async (req, res) => {
    try {
        const { id } = req.params;
        const blueprint = await Blueprint.findById(id).populate('surveyid');

        if (!blueprint) {
            return res.status(404).json(new ApiError(404, "Blueprint not found"));
        }

        return res.status(200).json(
            new ApiResponse(200, "Blueprint fetched successfully", blueprint)
        );
    } catch (error) {
        console.error("Get Blueprint Error:", error);
        return res.status(500).json(new ApiError(500, "Failed to fetch blueprint", error));
    }
};

// Update blueprint status (e.g. Approved/Review Needed)
const updateBlueprintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Approved', 'Review Needed'].includes(status)) {
            return res.status(400).json(new ApiError(400, "Invalid status"));
        }

        const blueprint = await Blueprint.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!blueprint) {
            return res.status(404).json(new ApiError(404, "Blueprint not found"));
        }

        return res.status(200).json(
            new ApiResponse(200, "Blueprint status updated", blueprint)
        );

    } catch (error) {
        console.error("Update Status Error:", error);
        return res.status(500).json(new ApiError(500, "Failed to update blueprint status", error));
    }
};

export {
    getAllBlueprints,
    getBlueprintById,
    updateBlueprintStatus
};
