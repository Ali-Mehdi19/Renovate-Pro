/**
 * Resolves a list of room measurements into X, Y coordinates.
 * @param {Array} roomData - Array of { length_m, angle_deg }
 * @returns {Array} Array of { x, y } coordinates
 */
const resolveVertices = (roomData) => {
    if (!Array.isArray(roomData) || roomData.length === 0) {
        throw new Error("Invalid room data: Must be a non-empty array.");
    }

    let vertices = [{ x: 0, y: 0 }]; // Start at origin (0,0)
    let currentAngle = 0; // Cumulative heading in radians

    roomData.forEach((wall, index) => {
        // Validate inputs
        if (typeof wall.length_m !== 'number' || typeof wall.angle_deg !== 'number') {
            throw new Error(`Invalid wall data at index ${index}: length_m and angle_deg must be numbers.`);
        }

        // 1. Update the heading based on the wall's interior angle
        // We subtract the angle to move clockwise or add for anti-clockwise
        // Assuming standard interior angles where 90 is a left turn? 
        // Let's stick to the previous logic: currentAngle += rad(angle)
        currentAngle += (wall.angle_deg * Math.PI) / 180;

        // 2. Project the next point using trigonometry
        const lastVertex = vertices[vertices.length - 1];
        const nextX = lastVertex.x + wall.length_m * Math.cos(currentAngle);
        const nextY = lastVertex.y + wall.length_m * Math.sin(currentAngle);

        // 3. Store the vertex
        // We implicitly assume the last wall connects back to 0,0 or close to it.
        // For distinct vertices, we push the new point.
        // If this is the last wall, its end point *should* be the start point (0,0).
        // specific logic for "closing" might be needed in future, but for now we just trace the path.
        if (index < roomData.length - 1) {
            vertices.push({
                x: parseFloat(nextX.toFixed(4)),
                y: parseFloat(nextY.toFixed(4))
            });
        }
    });

    return vertices;
};

export { resolveVertices };