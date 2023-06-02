const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('./registration.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const registrationProto = grpc.loadPackageDefinition(packageDefinition).registration;
const students = []; // In-memory student database

function registerStudent(call, callback) {
  const { name, age } = call.request;
  const id = students.length + 1;
  students.push({ id, name, age });
  callback(null, { id });
}

function main() {
  const server = new grpc.Server();
  server.addService(registrationProto.RegistrationService.service, {
    registerStudent: registerStudent,
  });
  server.bindAsync('localhost:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('Server started on port 50051');
  });
}

main();
