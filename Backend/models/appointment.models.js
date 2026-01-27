import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({

    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    surveyor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    date_time: {
        type: Date,
        required: true,
        index: true
    },
    address: {
        type: String,
        required: true,
        minlength: 10
    },
    geocode: {
        lat: { //latitude
            type: Number,
            required: true
        },
        lng: { //longitude
            type: Number,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled',
        index: true
    }

}, { timestamps: true });

const Appointment = mongoose.model('Appointment', AppointmentSchema)
export default Appointment;