const main = require("./swagger.json");
const tags = require("./tags.json");

const channelRoutes = require("./routes/channel.json");
const postRoutes = require("./routes/post.json");

const channelModels = require("./models/channel.json");
const postModels = require("./models/post.json");

const paths = {
  ...channelRoutes,
  ...postRoutes,
};

const definitions = {
  ...channelModels,
  ...postModels,
};

module.exports = {
  ...main,
  tags,
  definitions,
  paths,
  host: process.env.BASE_URL,
};
