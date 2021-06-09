FROM node:14

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

# Install app dependencies
RUN npm install
# Production: RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 6060

CMD [ "node", "index.js" ]

