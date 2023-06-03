# GRPC-NODEJS

npx grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./generated --grpc_out=./generated --proto_path=./registration.proto


ab -n 555 -c 100 -p payload.json -T application/json http://localhost:3000/