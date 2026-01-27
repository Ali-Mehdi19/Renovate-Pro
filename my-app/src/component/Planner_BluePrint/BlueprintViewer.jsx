import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BlueprintViewer = ({ blueprintId }) => {
    const [blueprint, setBlueprint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlueprint = async () => {
            try {
                setLoading(true);
                // Assuming backend runs on port 8000
                const response = await axios.get(`http://localhost:8000/api/planners/${blueprintId}`);
                setBlueprint(response.data.data);
            } catch (err) {
                setError("Failed to load blueprint");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (blueprintId) {
            fetchBlueprint();
        }
    }, [blueprintId]);

    if (loading) return <div className="p-4">Loading Blueprint...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!blueprint) return <div className="p-4">No blueprint selected</div>;

    return (
        <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Generated Blueprint</h2>

            <div className="bg-white border-2 border-gray-300 rounded p-4 overflow-auto max-w-full">
                {/* Render the Raw SVG safely */}
                <div
                    dangerouslySetInnerHTML={{ __html: blueprint.svgData }}
                    className="w-[800px] h-[600px] flex items-center justify-center transform scale-100 origin-top-left"
                />
            </div>

            <div className="mt-6 flex space-x-4">
                <div className="text-sm text-gray-600">
                    <span className="font-semibold">Status:</span> {blueprint.status}
                </div>
                <div className="text-sm text-gray-600">
                    <span className="font-semibold">Generated:</span> {new Date(blueprint.createdAt).toLocaleString()}
                </div>
            </div>
        </div>
    );
};

export default BlueprintViewer;
