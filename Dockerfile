FROM node:alpine

ENV ASSET_NAME="ConcreteFeedback"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN apk add --no-cache bash
RUN npm run boot

EXPOSE 4201

LABEL vf-OS=true
LABEL vf-OS.icon=img/2.png
LABEL vf-OS.urlprefixReplace=true
LABEL vf-OS.frontendUri="/app24"

CMD ["npm", "start"]
