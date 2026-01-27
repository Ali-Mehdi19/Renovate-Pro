// services/blueprintTrigger.js
import axios from 'axios';

export default async function triggerBlueprintGenerator(surveyId) {
    // We send a trigger to the specialized Blueprint Service 
    // In a production environment, use a message queue like RabbitMQ or BullMQ
    try {
        await axios.post(`${process.env.BLUEPRINT_SERVICE_URL}/generate`, { surveyId });
    } catch (err) {
        console.error("Failed to trigger generator service:", err.message);
        // Implement retry logic here 
    }
}