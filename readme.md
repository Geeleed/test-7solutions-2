ติดตั้ง package ที่จำเป็น

```bash
npm install
```

รัน grpc server เป็น service (ไฟล์ grpc.ts) จะอยู่ที่ localhost:50051

```bash
npm run grpc
```

รัน server สำหรับเรียกใช้ api ประเภท REST (ไฟล์ http.ts) ซึ่งจะดึง service จาก grpc server ซึ่งรันอยู่ที่ localhost:8000

```bash
npm run http
```

rest api endpoint สำหรับ test นี้

```bash
http://localhost:8000
```
