const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const client = require("./database");

const db = client.db("registration");
const collection = db.collection("registrations");

const packageDefinition = protoLoader.loadSync("./registration.proto", {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});

const registrationProto =
	grpc.loadPackageDefinition(packageDefinition).registration;

const RegisterUnary = async (call, callback) => {
	console.log(call.request)
	const BATCH_SIZE = 500;
	const data = [call.request];
	const batchedData = [];
	while (data.length > 0) {
		batchedData.push(data.splice(0, BATCH_SIZE));
	}
	const insertionPromises = batchedData.map((batch) =>
		collection.insertMany(batch),
	);

	await Promise.all(insertionPromises);
	callback(null, call.request);
};


function RegisterClientStream(call, callback) {
	call.on('data', async (request) => {
		//console.log('Received data:', request);

		const BATCH_SIZE = 500;
		const data = [request]
		const batchedData = [];
		while (data.length > 0) {
			batchedData.push(data.splice(0, BATCH_SIZE));
		}
		const insertionPromises = batchedData.map((batch) =>
			collection.insertMany(batch),
		);
		await Promise.all(insertionPromises);
	});

	call.on('end', () => {
		// Send the response back
		callback(null, { result: 'Data processed successfully' });
	});
}

function main() {
	const server = new grpc.Server();
	server.addService(registrationProto.RegistrationService.service, {
		RegisterUnary: RegisterUnary,
		RegisterClientStream: RegisterClientStream,
	});
	server.bindAsync(
		"localhost:50051",
		grpc.ServerCredentials.createInsecure(),
		() => {
			server.start();
			console.log("Server started on port 50051");
		},
	);
}

main();
