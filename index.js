/* ------------------ ApiResponse ------------------ */
class ApiResponse {
    static success(data, meta = {}) {
        return {
            data,
            meta: {
                timestamp: new Date().toISOString(),
                ...meta
            }
        };
    }

    static error(message, code = "ERROR", details = null, meta = {}) {
        return {
            error: {
                message,
                code,
                details
            },
            meta: {
                timestamp: new Date().toISOString(),
                ...meta
            }
        };
    }
}

/* ------------------ responseMiddleware ------------------ */
function responseMiddleware(req, res, next) {
    res.data = (payload, meta = {}, status = 200) => {
        meta = { 
            endpoint: req.originalUrl,
            method: req.method,
            responseCode: status,
            ...meta
        };
        return res.status(status).json(ApiResponse.success(payload, meta));
    };

    res.error = (message, code = "ERROR", status = 400, details = null, meta = {}) => {
        meta = { 
            endpoint: req.originalUrl,
            method: req.method,
            responseCode: status,
            ...meta
        };
        return res
            .status(status)
            .json(ApiResponse.error(message, code, details, meta));
    };

    next();
}

/* ------------------ Custom Errors ------------------ */
class AppError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class NotFoundError extends AppError {}
class ValidationError extends AppError {}
class UnauthorizedError extends AppError {}
class ForbiddenError extends AppError {}

/* ------------------ Error Registry ------------------ */
class ErrorRegistry {
    static map = {
        [ValidationError.name]: {
            message: "Invalid or missing data",
            code: "VALIDATION_ERROR",
            status: 422
        },
        [NotFoundError.name]: {
            message: "Resource not found",
            code: "NOT_FOUND",
            status: 404
        },
        [UnauthorizedError.name]: {
            message: "Authentication required",
            code: "UNAUTHORIZED",
            status: 401
        },
        [ForbiddenError.name]: {
            message: "Access denied",
            code: "FORBIDDEN",
            status: 403
        }
    };

    static resolve(err) {
        return this.map[err.name] || null;
    }
}

/* ------------------ Global Error Handler ------------------ */
function errorHandler(err, req, res, next) {
    const mapped = ErrorRegistry.resolve(err);

    if (mapped) {
        return res.error(
            mapped.message,
            mapped.code,
            mapped.status,
            null,
            { internal: err.message }
        );
    }

    console.error(err);

    return res.error(
        "An unexpected error occurred",
        "INTERNAL_SERVER_ERROR",
        500,
        null,
        { internal: err.message }
    );
}

/* ------------------ Async Wrapper ------------------ */
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/* ------------------ Exports ------------------ */
module.exports = {
    ApiResponse,
    responseMiddleware,
    AppError,
    NotFoundError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    errorHandler,
    asyncHandler
};
