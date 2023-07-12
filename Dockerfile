FROM node:18

RUN mkdir -p /app && mkdir -p /home/node && \
    chown -R node:node /app && \
        chown -R node:node /home/node
WORKDIR /app

USER node
COPY *.json /app/
RUN npm install  --loglevel=warn

COPY . /app

CMD [ "npm", "start" ]
