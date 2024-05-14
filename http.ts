import express from "express";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./summary.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const summaryProto: any = grpc.loadPackageDefinition(packageDefinition).summary;

const client = new summaryProto.SummaryService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  client.GetSummary({}, (error: any, response: any) => {
    if (error) {
      console.error("Error:", error);
    } else {
      const result = response.summaryDepartment;
      console.log("REST :", result);
      res.json(result);
    }
  });
});

app.listen(8000, () =>
  console.log("REST api server running on http://localhost:8000")
);
