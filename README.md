# Project overview

This project is a simple TypeScript application built to interact with the public Pipedrive API. It provides three endpoints that forward requests to the Pipedrive API endpoints for dealing with deals. Additionally, the application logs every action to the console and includes a /metrics endpoint that returns request metrics such as request duration and total requests count for all endpoints.

## Running the Application locally

To run the Application locally, follow these steps:

1. Clone the repository form GitHub:

```
git clone https://github.com/nkajl/devops-challenge.git
```

2. Create a `.env` file in the root directory of the project and specify your Pipedrive API token:

```
API_TOKEN=<your_api_token>
```

3. Build the Docker image

```
docker build -t ts-app .
```

4. Run the Docker container:

```
docker run -d -p 8080:3000 ts-app
```

This command will start the Docker container in detached mode, mapping port 3000 of the container to port 8080 on your host machine.

5. To view the logs, use the following command:

```
docker ps
```

This command will display a list of running containers along with their container IDs. Use the container ID of the `ts-app` container to view the logs:

```
docker logs <container_id>
```

## Endpoints

+ **GET /deals**: Fetches all deals from the Pipedrive API.

+ **POST /deals**: Creates a new deal in Pipedrive

+ **PUT /deals/:id**: 

+ **GET /metrics**: Returns request metrics such as mean request duration and latency for all endpoints.

## Logging

The application logs every action to the console. The logs include timestamp, log level, message, and additional data when applicable.

## Technology Stack

+ **Language**: TypeScript

+ **Frameworks/Libraries**: Express.js, Axios

+ **Dependency Management**: npm

+ **Environment Variable Management**: dotenv

+ **Containerization**: Docker

+ **Logging**: Winston

+ **Metrics**: prom-client


## Additional notes

+ Ensure that your Pipedrive API token is securely stored and never shared publicly.