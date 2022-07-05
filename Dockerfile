FROM node:14.19-buster-slim

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json /app/
RUN npm install --silent
COPY . /app/

# environment variables
ENV PORT=3000

# exposing running port
EXPOSE $PORT

# start app
CMD npm start --port $PORT