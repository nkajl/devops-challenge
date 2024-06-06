#!/bin/sh -eu
docker build -t ts-app .
docker run -it -p 3000:3000 ts-app
