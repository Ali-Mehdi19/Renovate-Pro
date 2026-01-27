/*
This controller manages the "Workflow Efficiency" objective (01) by handling the scheduling of site surveys.
Create Appointment: Allows customers to book a slot based on geocoded locations.
Assign Surveyor: Enables the system or admin to link a specific Surveyor_ID to a site visit.
**/

import Appointment from "../models/appointment.models.js";
import User from "../models/user.models.js";
import { asyncHandler } from '../models/appointment.models.js'
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const createAppointment = asyncHandler( async (req, res) => {
    try {
        
        const { date_time, address, geocode } = req.body;
        // Logic to ensure the date is in the future (Validity Check)

        const newAppointment = new Appointment({
            customer_id: req.user.id, // From Auth Middleware
            date_time,
            address,
            geocode,
            status: 'Scheduled'
        });
        await newAppointment.save();
        new ApiResponse(201, "Appointment created successfully: ", newAppointment)
    } catch (error) {
        new ApiError(400, "Failed to create an Appointment: ", error)
    }
});

const getSurveyorTasks = async (req, res) => {
    // FR3: Surveyor views assigned appointments 
    const tasks = await Appointment.find({ 
        surveyor_id: req.user.id, 
        status: 'Scheduled' 
    }).sort('date_time');
    res.json(tasks);
};

export default {
    createAppointment,
    getSurveyorTasks
}