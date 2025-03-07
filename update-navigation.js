const fs = require('fs');
const path = require('path');

// Get all HTML files in the current directory
fs.readdir('.', (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    // Filter out only HTML files
    const htmlFiles = files.filter(file => path.extname(file).toLowerCase() === '.html');
    
    htmlFiles.forEach(file => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading file ${file}:`, err);
                return;
            }

            // Check if navigation.js is already included
            if (data.includes('navigation.js')) {
                console.log(`${file} already includes navigation.js`);
                return;
            }

            // Find the position to insert the navigation.js script
            // We'll add it before the closing </head> tag
            const headCloseIndex = data.indexOf('</head>');
            
            if (headCloseIndex === -1) {
                console.error(`${file} does not have a closing head tag`);
                return;
            }

            // Insert the script tag for navigation.js
            const scriptTag = '  <script src="navigation.js"></script>\n';
            const updatedData = data.slice(0, headCloseIndex) + scriptTag + data.slice(headCloseIndex);

            // Write the updated content back to the file
            fs.writeFile(file, updatedData, 'utf8', err => {
                if (err) {
                    console.error(`Error writing to file ${file}:`, err);
                    return;
                }
                console.log(`Successfully updated ${file}`);
            });
        });
    });
}); 