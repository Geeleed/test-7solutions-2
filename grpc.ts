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

interface DepartmentDetail {
  male: number;
  female: number;
  ageRange: string;
  hair: {
    [color: string]: number;
  };
  addressUser: { [fullname: string]: string };
}
interface SummaryDepartment {
  [department: string]: DepartmentDetail;
}

// make service
const summary = async (): Promise<SummaryDepartment> => {
  const data = await fetch("https://dummyjson.com/users").then((r: any) =>
    r.json()
  );
  const users: any[] = data.users;
  const obj: SummaryDepartment = {};
  users.forEach((user) => {
    const dpt: string = user.company.department;
    const {
      gender,
      age,
      firstName,
      lastName,
    }: { gender: string; age: number; firstName: string; lastName: string } =
      user;
    const fullname = firstName + lastName;
    obj[dpt] = obj[dpt] || {};

    // gender
    obj[dpt]["male"] = obj[dpt]["male"] || 0;
    obj[dpt]["female"] = obj[dpt]["female"] || 0;
    gender === "male" ? obj[dpt]["male"]++ : obj[dpt]["female"]++;

    // age
    obj[dpt]["ageRange"] = obj[dpt]["ageRange"] || `${age}-${age}`;
    let [minAge, maxAge] = obj[dpt]["ageRange"].split("-").map(Number);
    minAge = Math.min(minAge, age);
    maxAge = Math.max(maxAge, age);
    obj[dpt]["ageRange"] = `${minAge}-${maxAge}`;

    // hair
    obj[dpt]["hair"] = obj[dpt]["hair"] || {};
    obj[dpt]["hair"][user.hair.color] = obj[dpt]["hair"][user.hair.color] || 0;
    obj[dpt]["hair"][user.hair.color]++;

    // addressUser
    obj[dpt]["addressUser"] = obj[dpt]["addressUser"] || {};
    obj[dpt]["addressUser"][fullname] = user.address.postalCode;
  });
  console.table(obj);
  return obj;
};

// call service
const getSummary = async (call: any, callback: any): Promise<void> => {
  const data = await summary();
  callback(null, { summaryDepartment: data });
};

const server = new grpc.Server();
// add service for public
server.addService(summaryProto.SummaryService.service, {
  GetSummary: getSummary,
});

// listen
server.bindAsync(
  "localhost:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log("gRPC server running on grpc://localhost:50051");
  }
);
