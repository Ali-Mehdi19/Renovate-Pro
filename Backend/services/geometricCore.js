/**
 * Resolves a list of room measurements into X, Y coordinates.
 * @param {Array} roomData - Array of { length_m, angle_deg }
 * @returns {Array} Array of { x, y } coordinates
 */
const resolveVertices = (roomData) => {
    let vertices = [{ x: 0, y: 0 }]; // Start at origin (0,0)
    let currentAngle = 0; // Cumulative heading in radians

    roomData.forEach((wall, index) => {
        // 1. Update the heading based on the wall's interior angle
        // We subtract the angle to move clockwise or add for anti-clockwise
        currentAngle += (wall.angle_deg * Math.PI) / 180;

        // 2. Project the next point using trigonometry
        const lastVertex = vertices[vertices.length - 1];
        const nextX = lastVertex.x + wall.length_m * Math.cos(currentAngle);
        const nextY = lastVertex.y + wall.length_m * Math.sin(currentAngle);

        // 3. Store the vertex (except for the final closing point which we handle in POC)
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