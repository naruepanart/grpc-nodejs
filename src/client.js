const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { promisify } = require("util");

const packageDefinition = protoLoader.loadSync("./registration.proto", {
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

const RegisterUnaryAsync = promisify(client.RegisterUnary).bind(client);

async function registerUnary(data) {
	try {
		const response = await RegisterUnaryAsync(data);
		console.log(response);
	} catch (error) {
		console.error("Error:", error.message);
	}
}

const RegisterClientStreamAsync = promisify(client.RegisterClientStream).bind(client);

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

const studentRequest = [];
for (let index = 0; index < 5; index++) {
	studentRequest.push({ data: `Name${index}` });
}

ClientStream(studentRequest);
