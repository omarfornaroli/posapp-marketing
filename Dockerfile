FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY . .
CMD ["npm", "run", "i"]

EXPOSE 3000

CMD ["npm", "run", "start"]
