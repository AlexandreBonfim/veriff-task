# Veriff Face Encoding Test Task

This project implements a minimal REST API for managing face verification sessions using Veriff's provided Face Encoding Docker image.

## 🚀 Features

- ✅ Create verification containers (`/verifications`)
- ✅ Upload up to 5 images per container
- ✅ Automatically process images via external face encoding service
- ✅ Store and retrieve 128-dimensional face encodings
- ✅ Fully Dockerized setup

## 📦 Tech Stack

- [NestJS](https://nestjs.com/) (TypeScript)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Multer](https://github.com/expressjs/multer) for file uploads
- [Docker Compose](https://docs.docker.com/compose/)

## ⚙️ Setup (via Docker)

### 1. Clone the repo

```bash
git clone https://github.com/AlexandreBonfim/veriff-task.git
cd veriff-face-task
```

### 2. Add .env file

```bash
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/veriff_db
FACE_ENCODER_API_URL=http://face-encoder:8000/v1/selfie
```

### 3. Run everything

```bash
docker compose up --build
```

This will:

- Start PostgreSQL, Face Encoder, and NestJS app
- Run Prisma migration on startup

### 📘 Swagger Docs

Once running, visit: [http://localhost:3000/api](http://localhost:3000/api)

You can test all endpoints interactively, including file uploads.

## 🧪 API Endpoints

### ✅ Create Verification

```bash
POST /verifications
```

Response:

```json
{ "id": "uuid", "createdAt": "..." }
```

### ✅ Upload Image (max 5 per verification)

```bash
POST /verifications/:id/images
Body: multipart/form-data with field file
```

Response: Image metadata

### ✅ Get Summary

```bash
GET /verifications/:id/summary
```

Response:

```json
{
  "verificationId": "uuid",
  "faces": [
    [0.12, 0.34, ..., 0.98] // 128 floats per face
  ]
}
```

## 🔧 Face Encoding API

This app connects to Veriff’s face encoding Docker service.
URL (inside Docker):

```bash
http://face-encoder:8000/v1/selfie
```

Automatically called after image upload
Each image may return 1 or more encodings (one per face)

## 🧼 Notes

- This solution assumes the client is authenticated (per spec)
- Images are not stored — only the encodings are persisted
- Prisma migrations are automatically applied at container startup

## 🧪 Testing

Run unit tests locally:

```bash
npm install
npx prisma generate
npm run test
```
