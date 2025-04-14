FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

ENV MONGODB_USERNAME=root
ENV MONGODB_PASSWORD=secret
ENV MONGODB_URL=mongodb
ENV PORT=4000

CMD ["npm", "start"]
