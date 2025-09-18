FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY . .
CMD ["npm", "i"]

EXPOSE 3000

CMD ["npm", "run", "start"]
