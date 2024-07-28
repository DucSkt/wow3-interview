FROM node:17.5-buster as base
RUN npm i -g pnpm@8.15.4
RUN npm i -g prisma

FROM base as builder
ENV CI=true
WORKDIR /app
COPY pnpm-lock.yaml ./




RUN pnpm fetch
ADD . ./
RUN pnpm install
RUN pnpm run generate
RUN pnpm run build

FROM base as runner
ENV CI=true
WORKDIR /app
COPY pnpm-lock.yaml ./



COPY package.json ./
COPY prisma ./prisma
RUN pnpm fetch --prod
RUN pnpm install -r --offline --prod

###################
# PRODUCTION
###################

FROM node:17.5-buster
# ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=runner /app/node_modules ./node_modules
#COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 3000
CMD ["npm", "run", "start:prod", "--verbose"]
