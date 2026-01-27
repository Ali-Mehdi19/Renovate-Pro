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
const generateCompleteBlueprint = (vertices, roomData) => {
    let annotations = "";
    
    for (let i = 0; i < vertices.length; i++) {
        const v1 = vertices[i];
        const v2 = vertices[(i + 1) % vertices.length]; // Loop back to start for closure
        annotations += generateDimensionLine(v1, v2, roomData[i].length_m);
    }

    const pathData = vertices.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.x * 100} ${v.y * 100}`).join(' ');

    return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1000 -1000 2000 2000">
            <path d="${pathData} Z" fill="#f9f9f9" stroke="black" stroke-width="3" />
            ${annotations}
        </svg>
    `;
};

export {
    generateSVG,
    generateDimensionLine,
    generateCompleteBlueprint
};