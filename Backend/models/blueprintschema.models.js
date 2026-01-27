import mongoose from 'mongoose'

const BlueprintSchema = new mongoose.Schema({
    surveyid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SurveyData', 
        required: true, 
        unique: true // [cite: 73, 95]
    },
    file_path: { 
        type: String, 
        required: true 
    },  
    file_type: { 
        type: String, 
        enum: ['SVG', 'PDF'], 
        default: 'SVG' 
    }, 
    dimensions: {
        width: { type: Number, required: true }, // 
        height: { type: Number, required: true } // 
    },
    date_generated: { 
        type: Date, 
        default: Date.now, 
        index: true 
    } 

}, { timestamps: true });

const Blueprint = mongoose.model('Blueprint', BlueprintSchema);
export default Blueprint;