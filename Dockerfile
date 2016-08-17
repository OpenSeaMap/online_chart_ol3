FROM node:4

RUN mkdir -p /code
WORKDIR /code

COPY . /code
RUN npm install bower -g  --loglevel=warn
RUN npm install  --loglevel=warn
RUN bower install  --loglevel=warn --allow-root

CMD [ "npm", "start" ]
