import mongoose from 'mongoose'

const SurveyDataSchema = new mongoose.Schema({
    apptid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
        unique: true
    },
    siteLocation: {
        address: {
            type: String,
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere' // Geospatial index for map views 
        }
    },
    rooms: [{ // Embedded array for read performance 

        room_type: { type: String, required: true }, // 

        length_m: { type: Number, required: true, min: 0.1, max: 50 }, // Range Check 

        angle_deg: { type: Number, required: true }, // Interior angle for vector closure

        height_m: { type: Number, required: true }, // [cite: 46]

        features: [{
            feature_type: { type: String }, // e.g., Door, Window 
            width_m: { type: Number } // 
        }],

        photos: [String]

    }],
    checksum: { type: String, required: true }
}, { timestamps: true });

const SurveyData = mongoose.model('SurveyData', SurveyDataSchema)
export default SurveyData;