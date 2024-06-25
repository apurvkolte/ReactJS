class ErrorHandler extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }

    logError() {
        console.error(`[${new Date().toISOString()}] [${this.statusCode}] ${this.message}`);
        // You can add more logging logic here if needed
    }

    toJSON() {
        return {
            success: false,
            error: {
                code: this.errorCode,
                message: this.message
            }
        };
    }
}

module.exports = ErrorHandler;
