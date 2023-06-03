const { MongoClient } = require("mongodb");
const dbUrl =
	process.env.MONGODB_URL ||
	"mongodb+srv://JtCqGymTW0vlPTIQ:G0zHqjQ9VnVo5QWs@cluster0.vnqxc.mongodb.net/a8?retryWrites=true&w=majority";
const client = new MongoClient(dbUrl, { useUnifiedTopology: true });
module.exports = client;
