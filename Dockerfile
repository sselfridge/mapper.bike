FROM node:20-alpine 

WORKDIR /app

COPY . ./

RUN npm i

RUN npm run build

EXPOSE 3000

RUN du -a /dir/ | sort -n -r | head -n 20


# CMD ["node","./server/start.js"]
CMD ["node"]

