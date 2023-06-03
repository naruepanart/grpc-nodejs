require("dotenv").config();
const express = require("express");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const app = express();

app.use(express.json());

const packageDefinition = protoLoader.loadSync("./src/registration.proto", {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});

const registrationProto =
	grpc.loadPackageDefinition(packageDefinition).registration;
const client = new registrationProto.RegistrationService(
	"localhost:50051",
	grpc.credentials.createInsecure(),
);

async function ClientStream(data) {
	const stream = client.RegisterClientStream((err, response) => {
		if (err) {
			console.error('Error:', err.message);
			return;
		}
		console.log('Server response:', response);
	});

	data.forEach((request) => {
		stream.write(request);
	});
	stream.end();
}

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post("/", async (req, res) => {
	const data = []
	data.push(req.body)
	const response = await ClientStream(data);
	res.json(response);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`);
});
