FROM ubuntu:22.04

WORKDIR /usr/node_app

COPY ./package.json ./

RUN apt-get update && apt-get install -y software-properties-common gcc && \
    add-apt-repository -y ppa:deadsnakes/ppa

RUN apt-get update && apt-get install -y python3.6 python3-distutils python3-pip python3-apt

RUN apt install curl -y

RUN curl -sL https://deb.nodesource.com/setup_18.x -o /tmp/setup.sh

RUN bash /tmp/setup.sh

RUN apt install nodejs -y

RUN npm install

COPY ./ ./

EXPOSE 4000

CMD ["npm", "run", "start-dev"]

