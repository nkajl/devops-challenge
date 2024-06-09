# Project overview

This TypeScript application interacts with the public Pipedrive API, offering endpoints for dealing with deals. It logs every action to the console and provides a /metrics endpoint for tracking request metrics, which are then visualized using Prometheus and Grafana.

## Running the Application locally

To run the application locally, ensure you have Docker and Docker Compose installed. Then follow these steps:

1. Clone the repository:

```
git clone https://github.com/nkajl/devops-challenge.git
```

2. Move to the project's root directory:

```
cd devops-challenge
```

3. Create a `.env` file and specify your Pipedrive API token:

```
API_TOKEN=<your_api_token>
```

4. Build and run project using the following command:

```
docker-compose up --build
```

This command will build the Docker images and start the containers defined in the docker-compose.yml file. The application will be accessible on `http://localhost:3000/deals`, the /metrics endpoint on `http://localhost:8080/metrics`, Prometheus on `http://localhost:9090`, and Grafana on `http://localhost:3001`. 

## Endpoints

+ **GET /deals**: Fetches all deals.

+ **POST /deals**: Creates a new deal.

+ **PUT /deals/:id**: Updates an already existing deal.

+ **GET 8080/metrics**: Returns request metrics.

# Continuous Integration (CI)

A CI pipeline is set up using GitHub Actions to ensure code integrity. It triggers on every commit to a pull request, running tests and linting processes.

## Testing process

The CI pipeline conducts unit tests to validate the behavior of individual API endpoints. Tests cover various scenarios, including successful responses, error handling, and interactions with external APIs, ensuring the application's integrity and reliability.

## Linting process

Linting is an automated code quality check that identifies potential errors, stylistic inconsistencies, and code smells in the codebase. The CI pipeline includes a linting process to enforce coding standards and maintain code readability.

## API Token in Github Actions

To securely authenticate API requests during testing, an API token is stored as a secret in GitHub Actions. This token is retrieved from environment variables during workflow execution and used to authorize requests to external APIs or services.

# Continuous Deployment (CD)

A separate GitHub Actions workflow handles CD, triggered upon successful merge into the master branch. It logs "Deployed!" upon completion, indicating successful deployment.

# Running Typescript Application within Dockerfile

+ `FROM node:21.2.0 AS build`: Docker provides a clean slate environment, the first step is to define the base image for Node.js. 

+ `WORKDIR /app`: Once Node.js environment is set up, the working directory within the Docker container is set to `/app`.

+ `COPY package*.json ./`: Next, project configuration files from the local directory arte copied into the container's working directory, allowing Docker to install project dependencies `RUN npm install`.

+ `COPY . .`: The entire project directory is copied into the container, ensuring that all source and configuration files are available in Docker environment.

+ `RUN npm run build`: The project is then built, compiles Typescript code into Javascript and generates `dist/` folder with main application file `index.js`.

+ `FROM node:21.2.0`: A new stage is created for optimizing the final Docker image, indicating it for production environment.

+ `WORKDIR /app`

+ `COPY package*.json` ...Some procedures are repeated

+ `RUN npm install --only=production`: Here we install only production dependencies to minimize the size of the final Docker image.

+ `COPY --from=build /app/dist ./dist` The built artifacts are copied from the previous stage into the final stage.

+ `COPY .env /app/`: Environment-specific configuration file is copied into the container.

+ `EXPOSE 3000, 8080`: Ports are exposed to allow external access to the application.

+ `CMD ["node", "dist/index.js"]`: Docker container runs the application using `node dist/index.js` command.

# Logging

The logs include timestamp, log level, message, and additional data when applicable.

![Logs in terminal](https://private-user-images.githubusercontent.com/158844130/337997129-a6d3fe11-5942-433b-9681-ce30d25fa8d2.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTc5NTY2MTQsIm5iZiI6MTcxNzk1NjMxNCwicGF0aCI6Ii8xNTg4NDQxMzAvMzM3OTk3MTI5LWE2ZDNmZTExLTU5NDItNDMzYi05NjgxLWNlMzBkMjVmYThkMi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwNjA5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDYwOVQxODA1MTRaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT05YzMzM2E4YmQwMDMxYTY4ZGRlYWE2ODg3ODFhZGM5NTdiNzA4MDI2MTkxYzA5YjkxOTU5N2NiM2RiYTYxMmIzJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.zvzq7Irj3Sxi6l94EFjL5vkkgEtqxNFfy5Nw771aeo4)

# Metrics Collection

The application uses the `prom-client` library to expose metrics at the `/metrics` endpoint. Prometheus is configured to scrape these metrics at regular intervals. Grafana is then used for visualizing the collected metrics.

![Metrics collection logic](https://private-user-images.githubusercontent.com/158844130/337997123-dc75758b-e869-4f5e-81c9-71dde3fb7f4a.jpg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTc5NTYyODEsIm5iZiI6MTcxNzk1NTk4MSwicGF0aCI6Ii8xNTg4NDQxMzAvMzM3OTk3MTIzLWRjNzU3NThiLWU4NjktNGY1ZS04MWM5LTcxZGRlM2ZiN2Y0YS5qcGc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwNjA5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDYwOVQxNzU5NDFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1mNDMwMzA5YzNiNDc0YzM0ODIwZTIxM2JkYWNlZmQ0MzE2MTU4YzhjNzA1Nzg5N2FmYTFmMTkxZDI3YmNiNTJiJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.XHxqkcMa1sV69n90FZDvZPsGF3x_A9dkNDjC0WVJafg)

## Prometheus Configuration

The `prometheus.yml` file contains the configuration for Prometheus to scrape metrics from a specified port where the /metrics endpoint is located.

![Prometheus setup](https://private-user-images.githubusercontent.com/158844130/337997128-10ed7068-4739-4ecb-b484-f7b6f0f5d691.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTc5NTY2MTQsIm5iZiI6MTcxNzk1NjMxNCwicGF0aCI6Ii8xNTg4NDQxMzAvMzM3OTk3MTI4LTEwZWQ3MDY4LTQ3MzktNGVjYi1iNDg0LWY3YjZmMGY1ZDY5MS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwNjA5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDYwOVQxODA1MTRaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT00YTE4MTBlNGMyNTE0MDE0MjhmZDFhNWU1YWU5ODkyNzc5MWY0YmNkNTE3ZGRkOGVlNjk0NWU3YjRhZjlkZTgzJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.mVZITtc4AAib078tttoGMEQFHcOZqeh4uKeRyUHEyW8)

## Grafana Configuration

The Grafana program is configured to automatically download the dashboard from a JSON file, the path to which is specified in the dashboard.yml file. Due to Docker Compose volumes, the saved dashboard can be retrieved from the Docker environment. This setup ensures that the same dashboard configuration is available across different environments, making it easy to set up and repeat.

![Grafana setup](https://private-user-images.githubusercontent.com/158844130/337997126-7a8a24af-a6a6-4080-b49f-2b240f785e45.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTc5NTY2MTQsIm5iZiI6MTcxNzk1NjMxNCwicGF0aCI6Ii8xNTg4NDQxMzAvMzM3OTk3MTI2LTdhOGEyNGFmLWE2YTYtNDA4MC1iNDlmLTJiMjQwZjc4NWU0NS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwNjA5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDYwOVQxODA1MTRaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0yOWFhYTc3NjU1ZGY3ODZlNDBjNzhiNjg1MzNlMTI5NzY1NmUwNjYxNjQyZmVjYTEzMDRhZWRhOTU0M2E1ZWNkJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.HXIhT2Hf85I7cWClEPXf6A4Pj_DoP6Qb83vSbV7q6tM)

## Technology Stack

+ **Language**: TypeScript

+ **Frameworks/Libraries**: Express.js, Axios

+ **Dependency Management**: npm

+ **Environment Variable Management**: dotenv

+ **Containerization**: Docker

+ **Logging**: Winston

+ **Metrics**: prom-client, Prometheus, Grafana
