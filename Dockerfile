FROM node:4

RUN mkdir -p /code
WORKDIR /code

# Install app dependencies
RUN npm install bower -g  --loglevel=warn

COPY package.json /code
RUN npm install  --loglevel=warn

COPY bower.json /code
RUN bower install  --loglevel=warn --allow-root

COPY . /code

ENTRYPOINT [ "npm", "run" ]
