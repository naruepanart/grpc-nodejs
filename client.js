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

function registerStudent() {
  const client = new registrationProto.RegistrationService('localhost:50051', grpc.credentials.createInsecure());

  const studentRequest = {
    name: 'John Doe',
    age: 20,
  };

  client.registerStudent(studentRequest, (err, response) => {
    if (err) {
      console.error('Error:', err.message);
      return;
    }
    console.log('Student registered with ID:', response.id);
  });
}

registerStudent();
