const express = require("express");
const cors = require("cors");
const globalErrorHandler = require("./controller/error");
const AppError = require("./utils/app_error");
const indexRouter = require("./routes");
const swagger = require("swagger-ui-express");
const swaggerDocs = require("./docs");

// Initialize express app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Documentation
app.use("/api/docs", swagger.serve, swagger.setup(swaggerDocs));

// handles all routes of /api route
indexRouter(app);

// 404 Error
app.all("*", (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
