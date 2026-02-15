const generateSVG = (vertices, roomType) => {
    // 1. Create the path string from vertices
    const pathData = vertices.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.x * 100} ${v.y * 100}`).join(' ');

    // 2. Wrap in SVG XML structure (FR6)
    return `
        <svg xmlns="http://www.w3.org/2000/api/svg" viewBox="-500 -500 1000 1000">
            <path d="${pathData} Z" fill="none" stroke="black" stroke-width="2" />
            <text x="0" y="0" font-size="20">${roomType}</text>
        </svg>
    `;
};


//This code generates the arrows and the text label for each wall segment.
const generateDimensionLine = (v1, v2, length) => {
    const offset = 25; // Distance from the wall

    // 1. Calculate the direction vector of the wall
    const dx = v2.x - v1.x;
    const dy = v2.y - v1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // 2. Calculate the normal (perpendicular) vector
    const nx = -dy / dist;
    const ny = dx / dist;

    // 3. Offset coordinates for the dimension line
    const x1 = (v1.x * 100) + nx * offset;
    const y1 = (v1.y * 100) + ny * offset;
    const x2 = (v2.x * 100) + nx * offset;
    const y2 = (v2.y * 100) + ny * offset;

    // 4. Midpoint for the text label
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    return `
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="blue" stroke-width="1" stroke-dasharray="4" />
        <circle cx="${x1}" cy="${y1}" r="2" fill="blue" />
        <circle cx="${x2}" cy="${y2}" r="2" fill="blue" />
        <text x="${midX}" y="${midY - 5}" font-size="12" fill="blue" text-anchor="middle">
            ${length.toFixed(2)}m
        </text>
    `;
};


//The generateSVG function now loops through the vertices to add these annotations for every wall captured in the SURVEY_DATA
const generateCompleteBlueprint = (rooms) => {
    // rooms structure: [{ name: "Living", vertices: [...], walls: [...] }, ...]

    let allPaths = "";
    let allAnnotations = "";
    let offsetX = 0;
    const GAP = 500; // Gap between rooms

    rooms.forEach((room, roomIndex) => {
        const { vertices, walls, name } = room;

        // Safety check
        if (!vertices || !walls) return;

        // Apply Offset to Vertices for this room
        const shiftedVertices = vertices.map(v => ({
            x: v.x + offsetX,
            y: v.y
        }));

        // Generate Path
        const pathData = shiftedVertices.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.x * 100} ${v.y * 100}`).join(' ');

        // Random pastel color for room fill
        const colors = ["#e0f2fe", "#f0fdf4", "#fef3c7", "#fce7f3", "#f3f4f6"];
        const fillColor = colors[roomIndex % colors.length];

        allPaths += `
            <g id="${name}">
                <path d="${pathData} Z" fill="${fillColor}" stroke="black" stroke-width="3" />
                <text x="${(shiftedVertices[0].x * 100) + 50}" y="${(shiftedVertices[0].y * 100) + 50}" font-size="30" font-family="serif" fill="black">${name}</text>
            </g>
        `;

        // Generate Annotations
        for (let i = 0; i < shiftedVertices.length; i++) {
            const v1 = shiftedVertices[i];
            const v2 = shiftedVertices[(i + 1) % shiftedVertices.length];
            const length = walls[i] ? walls[i].length_m : 0;
            allAnnotations += generateDimensionLine(v1, v2, length);
        }

        // Increment Offset (Estimated width of room approx 5m = 500px, so move 600px)
        // A better way would be bounding box calculation, but logic simple for now.
        offsetX += 6 + (Math.max(...vertices.map(v => v.x)) - Math.min(...vertices.map(v => v.x)));
    });

    return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-500 -500 3000 2000">
             <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="gray" stroke-width="0.5" opacity="0.2"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            ${allPaths}
            ${allAnnotations}
        </svg>
    `;
};

export {
    generateSVG,
    generateDimensionLine,
    generateCompleteBlueprint
};