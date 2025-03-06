/**
 * Icon Generator for Java DS PWA
 * Run this script with Node.js to generate the required PWA icons
 * 
 * Prerequisites:
 * - Node.js installed
 * - Canvas package installed (npm install canvas)
 * - fs package (built into Node.js)
 * - path package (built into Node.js)
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

// Icon sizes to generate
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// App colors from CSS
const primaryColor = '#FF4500';   // Orange-Red
const accentColor = '#00BFFF';    // Deep Sky Blue
const darkColor = '#1a1a1a';      // Almost Black
const highlightColor = '#FF8C00'; // Dark Orange

// Function to generate an icon
function generateIcon(size) {
  // Create canvas with the desired size
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = darkColor;
  ctx.fillRect(0, 0, size, size);
  
  // Outer circle - accent color
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.45, 0, Math.PI * 2);
  ctx.fillStyle = accentColor;
  ctx.fill();
  
  // Inner circle - primary color
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.35, 0, Math.PI * 2);
  ctx.fillStyle = primaryColor;
  ctx.fill();
  
  // Add "J" text in the center
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${size * 0.4}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('J', size / 2, size / 2);
  
  // Add small DS label
  ctx.font = `bold ${size * 0.15}px Arial`;
  ctx.fillText('DS', size / 2, size / 2 + size * 0.2);
  
  // Save the icon to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.png`), buffer);
  console.log(`Generated icon-${size}x${size}.png`);
}

// Generate all icons
console.log('Generating PWA icons...');
sizes.forEach(size => generateIcon(size));
console.log('All icons generated!');
console.log(`Icons saved to: ${iconsDir}`);
console.log('\nTo use these icons, run: npm install canvas');
console.log('Then run: node generate-icons.js'); 