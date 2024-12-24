# Step 1: Use Node.js base image
FROM node:18-alpine AS builder

# Step 2: Set build-time environment variable
ARG OPENAI_API_KEY

# Step 3: Set working directory
WORKDIR /app

# Step 4: Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 5: Copy the rest of the application source code
COPY . .

# Step 6: Inject environment variable into the build
ENV OPENAI_API_KEY=$OPENAI_API_KEY

# Step 7: Build the application
RUN npm run build

# Step 8: Use a lightweight Node.js image for production
FROM node:18-alpine AS runner
WORKDIR /app

# Step 9: Copy necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Step 10: Expose the application port
EXPOSE 1401

# Step 11: Start the Next.js server
CMD ["npm", "run", "start"]
