# 🔋 Battery Passport Microservices Backend

A scalable Node.js microservices backend for managing Battery Passports, Documents, User Authentication, and Notifications using Kafka, MongoDB, and MinIO.

---

## 🧰 Tech Stack

- **Node.js** (Express)
- **MongoDB** (with Mongoose)
- **Kafka** (via KafkaJS)
- **MinIO** (S3-compatible storage)
- **Docker & Docker Compose**
- **JWT Auth**
- **Swagger** (OpenAPI documentation)

---

## 📦 Microservices Overview

| Service             | Description                                      | Port   |
|---------------------|--------------------------------------------------|--------|
| **Auth Service**     | Handles user registration & login                | 4000   |
| **Passport Service** | Manages battery passport creation & updates      | 4001   |
| **Document Service** | Upload/download of document files                | 4002   |
| **Notification Service** | Listens to Kafka events and logs notifications | 4003   |
| **MongoDB**          | Shared database                                  | 27017  |
| **Kafka + Zookeeper**| Message broker for inter-service communication   | 9092/2181 |
| **MinIO**            | S3-compatible object storage                     | 9000   |

---

## 🚀 Getting Started

### 🔧 1. Clone the Repo & Start Services

```bash
git clone https://github.com/AbhishekParsoya/battery-passport-backend.git
cd battery-passport-backend
docker-compose up --build
````

### 🔐 2. Environment Variables (Handled via Docker Compose)

Each service accepts:

* `PORT`
* `MONGO_URI`
* `JWT_SECRET`
* `KAFKA_BROKER`
* `MINIO_*` (for document-service)

---

## 📄 Swagger API Docs

| Service          | Swagger UI                                                       |
| ---------------- | ---------------------------------------------------------------- |
| Auth Service     | [http://localhost:4000/api-docs](http://localhost:4000/api-docs) |
| Passport Service | [http://localhost:4001/api-docs](http://localhost:4001/api-docs) |
| Document Service | [http://localhost:4002/api-docs](http://localhost:4002/api-docs) |

---

## 🔐 Authentication Flow

* **Register/Login** to get a JWT token
* Include token in all secure routes:

```http
Authorization: Bearer <token>
```

* Roles: `admin`, `user`
* Admin can create/update/delete passports and upload documents

---

## 🧪 API Testing (with cURL)

### ✅ Register User

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "123456", "role": "admin"}'
```

### 🔓 Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "123456"}'
```

---

## 🧾 Sample: Create Passport

```bash
curl -X POST http://localhost:4001/api/passports \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "generalInformation": {
        "batteryIdentifier": "BAT123",
        "batteryModel": {
          "id": "MOD456",
          "modelName": "Tesla Model X"
        },
        "batteryMass": 150,
        "batteryCategory": "EV",
        "batteryStatus": "Active",
        "manufacturingDate": "2023-01-01",
        "manufacturingPlace": "California",
        "warrantyPeriod": "2 years",
        "manufacturerInformation": {
          "manufacturerName": "Tesla",
          "manufacturerIdentifier": "TES001"
        }
      }
    }
  }'
```

---

## 📁 Document Upload

```bash
curl -X POST http://localhost:4002/api/documents/upload \
  -H "Authorization: Bearer <JWT>" \
  -F "file=@dummy.pdf" \
  -F "passportId=<PASSPORT_ID>"
```

---

## 📬 Kafka Events

| Event              | Emitted by       | Consumed by          |
| ------------------ | ---------------- | -------------------- |
| `passport.created` | Passport Service | Notification Service |
| `passport.updated` | Passport Service | Notification Service |
| `passport.deleted` | Passport Service | Notification Service |

All events are logged to `notifications.log`.

---

## 🗃 MinIO Storage (for Documents)

MinIO is used for storing uploaded documents.

* Dashboard: [http://localhost:9000](http://localhost:9000)
* Access Key: `minioadmin`
* Secret Key: `minioadmin`

---

## 📂 Directory Structure (Sample)

```
battery-passport-backend/
├── auth-service/
├── passport-service/
├── document-service/
├── notification-service/
├── docker-compose.yml
└── README.md
```

---

## 🛠 Development Notes

* All services are decoupled and communicate via Kafka
* MongoDB is used across services for persistence
* Each service has its own Swagger UI
* Auth is JWT-based with role-level permissions



Absolutely! Here's a complete section for your `README.md` that documents the **Render deployment links**, and clearly states that **Kafka and S3 (MinIO)** are **not supported** on Render but the services **degrade gracefully** without errors.

---

### 🚀 Deployed Services on Render

| Service                  | Description                               | Render URL                                                    |
| ------------------------ | ----------------------------------------- | ------------------------------------------------------------- |
| **Auth Service**         | Handles user registration, login & tokens | [auth-service](https://battery-passport-backend.onrender.com) |
| **Passport Service**     | Manages Battery Passport data             | [passport Service](https://passport-service.onrender.com)                                                 |
| **Document Service**     | Uploads, downloads, and updates documents | [document-service](https://document-service-coxt.onrender.com)                                                 |
| **Notification Service** | Listens to Kafka events and logs activity | [notification-service]( https://notification-service-l2c2.onrender.com)                 |

---

### ⚠️ Deployment Notes

* **Kafka is not supported on Render:**
  Kafka-based services (e.g., Notification Service) are disabled in production using `NODE_ENV=production`. These services **do not crash** but **skip Kafka setup gracefully**.

* **MinIO/S3 is not supported on Render:**
  Since MinIO is container-based and cannot run natively on Render, the **Document Service** disables S3 storage when `NODE_ENV !== development`. No errors are thrown, and API endpoints return appropriate fallback responses.

* You can use **Confluent Cloud for Kafka** or **Amazon S3** if you want to extend these features to production in the future.

---


## ✅ Future Enhancements

* [ ] Email notifications via SMTP / Mailgun
* [ ] CI/CD pipeline (GitHub Actions + DockerHub)
* [ ] Health checks for each service
* [ ] Global rate limiting / API usage monitoring
* [ ] Centralized logging (Winston + ELK stack)

---
