#!/bin/sh -eu
docker build -t ts-app .
docker run -it -p 3000:3000 -p 8080:8080 ts-app
