// (node server.js) using this command we can start the server it can give the port  http://localhost:3000/. This port gives the quiz application.
// Import required modules for creating a simple HTTP server
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create an HTTP server that listens for requests and responds accordingly
const server = http.createServer((req, res) => {
    // Constructed the absolute file path using the current working directory and the requested URL
    const filePath = path.join(__dirname, req.url);

    // Handle requests for the favicon.ico (icon displayed in browser tabs)
    if (req.url === '/favicon.ico') {
        // Respond with a 204 status (No Content) and end the response
        res.writeHead(204, { 'Content-Type': 'image/x-icon' });
        res.end();
        return;
    }

    // Check if the requested path corresponds to a directory
    const isDirectory = fs.statSync(filePath).isDirectory();

    // If the requested path is a directory, serve an HTML file (eg:index.html)
    if (isDirectory) {
        // Construct the path to the index.html file within the requested directory
        const indexFilePath = path.join(filePath, 'index.html');
        
        // Check if the index.html file exists
        if (fs.existsSync(indexFilePath)) {
            // If it exists, create a read stream for the file and pipe it to the response
            const stream = fs.createReadStream(indexFilePath);
            stream.pipe(res);
        } else {
            // If index.html does not exist, respond with a 404 status and a plain text message
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    } else {
        // If the requested path is not a directory, create a read stream for the file and pipe it to the response
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    }
});

// Start the server and listen on port 3000
server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000/');
});
