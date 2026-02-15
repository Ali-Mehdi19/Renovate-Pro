import mongoose from 'mongoose'

const BlueprintSchema = new mongoose.Schema({
    surveyid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SurveyData',
        required: true,
        unique: true
    },
    svgData: {
        type: String, // Storing raw SVG for the frontend viewer
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Review Needed'],
        default: 'Pending'
    },
    plannerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    file_path: {
        type: String,
        required: false // Made optional as we store svgData
    },
    file_type: {
        type: String,
        enum: ['SVG', 'PDF'],
        default: 'SVG'
    },
    dimensions: {
        width: { type: Number, default: 1000 },
        height: { type: Number, default: 1000 }
    },
    date_generated: {
        type: Date,
        default: Date.now,
        index: true
    }

}, { timestamps: true });

const Blueprint = mongoose.model('Blueprint', BlueprintSchema);
export default Blueprint;