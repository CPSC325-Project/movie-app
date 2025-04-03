const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const fetch = require("node-fetch"); // You'll need to install this

// API proxy function to handle the mixed content issue
exports.apiProxy = onRequest(async (request, response) => {
  try {
    // Log incoming request
    logger.info("API Proxy request", {
      path: request.path,
      method: request.method,
    });

    // Construct the target URL by replacing /api with empty string
    const targetPath = request.path.replace(/^\/api/, "");
    const url = `http://54.177.14.82:8000${targetPath}`;
    
    logger.info("Forwarding to:", { url });

    // Set up request options
    const options = {
      method: request.method,
      headers: {
        // Forward relevant headers
        "Content-Type": request.headers["content-type"] || "application/json",
      },
    };

    // Add body for non-GET requests
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      options.body = JSON.stringify(request.body);
    }

    // Make the request to the API server
    const apiResponse = await fetch(url, options);
    
    // Get response data
    const data = await apiResponse.text();
    
    // Set CORS headers
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    response.set("Access-Control-Allow-Headers", "Content-Type");
    
    // Set content type based on what the API returned
    response.set("Content-Type", apiResponse.headers.get("content-type") || "application/json");
    
    // Return the API response
    response.status(apiResponse.status).send(data);
  } catch (error) {
    logger.error("Error in API proxy:", error);
    response.status(500).send({
      error: "Failed to proxy request to API server",
      message: error.message
    });
  }
});