const { createServer } = require('http');
const next = require('next');
const connection = require('./config/connection');
const winston = require('./winston/config');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Middleware to serve static files
const serve = serveStatic(path.join(process.cwd(), 'public'), {
    index: false, // Don't use directory index
});

connection.getConnection((error) => {
    if (error) {
        winston.info("Database connection failed:", error.message);
        console.log("Database connection failed:", error.message);
        throw error;
    }
    winston.info("Database is connected successfully...!");
    console.log("Database is connected successfully...!");
});

app.prepare().then(() => {
    createServer((req, res) => {
        // Serve static files
        serve(req, res, (err) => {
            if (err) {
                finalhandler(req, res)(err);
            } else {
                // Handle other requests with Next.js
                handle(req, res);
            }
        });
    }).listen(3000, (err) => {
        if (err) {
            winston.info("Error on server.js:", err);
            console.log("Error on server.js:", err);
            throw err;
        }
        console.log('> Ready on http://localhost:3000');
        winston.info("> Ready on http://localhost:3000");
    });
});
