# Project overview

This project is a simple TypeScript application built to interact with the public Pipedrive API. It provides three endpoints that forward requests to the Pipedrive API endpoints for dealing with deals. The application logs every action to the console and includes a /metrics endpoint that returns request metrics such as total request response time, last request response time and total requests count for all endpoints. Additionally, these metrics are scraped by Prometheus, which then forwards the data to Grafana, where the metrics are automatically visualized in the form of graphs.

## Running the Application locally

Before running this project, make sure you have the following installed on your machine:

+ **Docker**

+ **Docker Compose**

To run the Application, follow these steps:

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

## Running Typescript Application within Dockerfile

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

## Logging

The logs include timestamp, log level, message, and additional data when applicable.

<img src=terminal.png>

## Metrics Collection

The application uses the `prom-client` library to expose metrics at the `/metrics` endpoint. Prometheus is configured to scrape these metrics at regular intervals. Grafana is then used for visualizing the collected metrics.

## Prometheus Configuration

The `prometheus.yml` file contains the configuration for Prometheus to scrape metrics from a specified port where the /metrics endpoint is located.

<img src=prometheus.png>

## Grafana Configuration

The Grafana program is configured to automatically download the dashboard from a JSON file, the path to which is specified in the dashboard.yml file. Due to Docker Compose volumes, the saved dashboard can be retrieved from the Docker environment. This setup ensures that the same dashboard configuration is available across different environments, making it easy to set up and repeat.

<img src=grafana.png>

## Continuous Integration (CI)

Using GitHub Actions, a CI pipeline has been set up to ensure the integrity of the code. The pipeline automatically triggers on each commit pushed to a pull-request, executing tests and linting processes to maintain code quality standards.

## Continuous Deployment (CD)

Another GitHub Actions workflow has been configured for Continuous Deployment (CD). This workflow is triggered exclusively when a pull-request is successfully merged into the master branch. Its sole purpose is to log "Deployed!" upon completion, signaling the successful deployment of the application.

## Technology Stack

+ **Language**: TypeScript

+ **Frameworks/Libraries**: Express.js, Axios

+ **Dependency Management**: npm

+ **Environment Variable Management**: dotenv

+ **Containerization**: Docker

+ **Logging**: Winston

+ **Metrics**: prom-client, Prometheus, Grafana
