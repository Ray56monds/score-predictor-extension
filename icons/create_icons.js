const fs = require('fs');

// Minimal PNG data (green square with white circle)
function createPNG(size) {
    const canvas = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="#27ae60"/>
        <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="white"/>
        <text x="${size/2}" y="${size/2 + size/8}" font-size="${size/2}" text-anchor="middle" fill="#27ae60">⚽</text>
    </svg>`;
    return canvas;
}

// For now, create SVG files that Chrome can use
fs.writeFileSync('icon16.svg', createPNG(16));
fs.writeFileSync('icon48.svg', createPNG(48));
fs.writeFileSync('icon128.svg', createPNG(128));

console.log('SVG icons created. Use icon_generator.html to create PNG versions.');
