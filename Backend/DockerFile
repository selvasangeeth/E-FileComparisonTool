FROM node:20-alpine
WORKDIR /usr/src/app
COPY ["package.json", "./"]
COPY . .
COPY .env ./
RUN apk add --no-cache \
      chromium
RUN npm install
RUN apk add --no-cache tzdata
ENV TZ="Etc/UTC"
RUN date
RUN chown -R node /usr/src/app
RUN mkdir -p /home/node/.npm && chown -R 1000:1000 /home/node/.npm || true
USER node
ENTRYPOINT ["npm", "start"]
