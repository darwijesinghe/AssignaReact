# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Build argument
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ARG REACT_APP_GOOGLE_CLIENT_ID
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID

# Copy package files first (better caching)
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Build React app
RUN npm run build

# Serve stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default Nginx content
RUN rm -rf ./*

# Copy build files to Nginx
COPY --from=build /app/build .

# Custom Nginx config so React Router works on refresh
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]