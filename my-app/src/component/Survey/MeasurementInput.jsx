import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const SurveySchema = z.object({
    roomType: z.string().min(1, "Room type is required"),
    length_m: z.coerce.number()
        .min(0.1, "Length must be positive")
        .max(50, "Length exceeds 50m limit"),
    angle_deg: z.coerce.number()
        .min(0, "Angle must be positive")
        .max(360, "Angle must be less than 360"),
    height_m: z.coerce.number().min(0.1, "Height must be positive")
});

const MeasurementInput = ({ onSave }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(SurveySchema),
    });

    const onSubmit = (data) => {
        onSave(data);
        reset();
    };

    return (
        <div className="p-4 bg-white shadow rounded-lg max-w-md mx-auto">
            <h3 className="text-lg font-bold mb-4">Add Room Measurement</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Room Type */}
                <div>
                    <label className="block text-sm font-medium mb-1">Room Type</label>
                    <select {...register('roomType')} className="w-full p-2 border rounded">
                        <option value="">Select Type</option>
                        <option value="Living Room">Living Room</option>
                        <option value="Bedroom">Bedroom</option>
                        <option value="Kitchen">Kitchen</option>
                        <option value="Bathroom">Bathroom</option>
                    </select>
                    {errors.roomType && <p className="text-red-500 text-xs">{errors.roomType.message}</p>}
                </div>

                {/* Length */}
                <div>
                    <label className="block text-sm font-medium mb-1">Wall Length (Meters)</label>
                    <input
                        {...register('length_m')}
                        type="number"
                        step="0.01"
                        inputMode="decimal"
                        className="w-full p-2 border rounded"
                        placeholder="e.g. 5.5"
                    />
                    {errors.length_m && <p className="text-red-500 text-xs">{errors.length_m.message}</p>}
                </div>

                {/* Angle */}
                <div>
                    <label className="block text-sm font-medium mb-1">Interior Angle (Degrees)</label>
                    <input
                        {...register('angle_deg')}
                        type="number"
                        step="0.1"
                        inputMode="decimal"
                        className="w-full p-2 border rounded"
                        placeholder="e.g. 90"
                    />
                    {errors.angle_deg && <p className="text-red-500 text-xs">{errors.angle_deg.message}</p>}
                </div>

                {/* Height */}
                <div>
                    <label className="block text-sm font-medium mb-1">Ceiling Height (Meters)</label>
                    <input
                        {...register('height_m')}
                        type="number"
                        step="0.01"
                        inputMode="decimal"
                        className="w-full p-2 border rounded"
                        placeholder="e.g. 2.8"
                    />
                    {errors.height_m && <p className="text-red-500 text-xs">{errors.height_m.message}</p>}
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                    Add Wall
                </button>
            </form>
        </div>
    );
};

export default MeasurementInput;
