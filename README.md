# portal
Repository for real estate portal in Bali

There are two projects contained within this repo:
1. Backend <br/>
   Would serve as the backend server for the portal.
   This backend will have APIs that the frontend can use. Initially, we will close this API to the public but it is designed with expansibility in mind so others can call the API without having the need to use our own UI.
   Tech stack: Express, Postgress SQL
2. Frontend <br/>
   The frontend portion of the portal would pull data from the API calls to the backend.
   Tech stack: Node, React/Next

---

## Docker Build & Run Instructions

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/) installed.

### Building Docker Images

From the root of the repository, run:

```sh
docker compose build
```

Or, if building individual images for linux/amd64 (needed to push to EC2):
```sh
docker build --platform linux/amd64 -t portal-backend ./backend
docker build --platform linux/amd64 -t portal-frontend ./frontend
```

This will build both the backend and frontend images as defined in docker-compose.yml.

Running the Containers
After building, start the services with:

```sh
docker compose up
```

This will start all services (backend, frontend, and any dependencies).

Stopping and Removing Containers
To stop the containers:

```sh
docker compose down
```

To remove containers, networks, and images built by Compose:
```sh
docker compose down --rmi all
```

Rebuilding Images
If you make changes to the Dockerfiles or dependencies, rebuild with:

```sh
docker compose build
```

To save images into tar files before uploading to EC2 instance:
```sh
docker save -o portal-backend.tar portal-backend
docker save -o portal-frontend.tar portal-frontend
```


Access the app:

Frontend: http://localhost:3000
Backend API/Swagger: http://localhost:3001/api-docs


Running on EC2:

To create network so that frontend knows the backend within the same instance:
docker network create portal-network
docker run -d --name backend --network portal-network <backend-image>
docker run -d --name frontend --network portal-network -p 3000:3000 <frontend-image>
