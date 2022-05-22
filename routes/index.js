const channelRouter = require("./channel");
const postRouter = require("./post");

module.exports = (app) => {
  app.use("/api/channel", channelRouter);
  app.use("/api/post", postRouter);
};
