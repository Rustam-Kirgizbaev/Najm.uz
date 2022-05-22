const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cron = require("node-cron");
const TimesController = require("./controller/times");
const app = require("./app");

dotenv.config();

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
).replace("<username>", process.env.DATABASE_USERNAME);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("\x1b[35mDatabase connection successful \x1b[0m"));

cron.schedule("0 0 7 * * *", async () => {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  await TimesController.sendTimes(day, month);
});

const port = process.env.PORT || 3110;
const server = app.listen(port, () => {
  console.log(`\x1b[35mApp running on port ${port} \x1b[0m`);
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
