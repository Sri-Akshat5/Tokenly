# Stage 1: Build the static Vite client
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
# react-helmet-async's declared peer range doesn't yet include React 19
RUN npm install --legacy-peer-deps

# Declared after npm install so that changing the API URL alone doesn't
# invalidate (and re-run) the slow install step on rebuild.
ARG VITE_API_BASE_URL=http://localhost:8084
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY . .
RUN npm run build

# Stage 2: Serve the build with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
