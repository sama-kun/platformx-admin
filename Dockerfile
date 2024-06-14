# Stage 1: Build
FROM node:18 as build

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy all files and build
COPY . .
RUN yarn run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Install production dependencies
COPY package.json yarn.lock ./
RUN yarn install -prod

# Copy build
COPY --from=build /app/.next /app/.next

# Start
CMD sh -c "yarn start"
