# build front-end
FROM node:lts AS frontend

# Define build-time variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Set them as environment variables for use in the container
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}

# Set build arguments
ARG VITE_LUMA_KEY
ARG VITE_LUMA_SERVER
ARG VITE_VIGGLE_KEY
ARG VITE_VIGGLE_SERVER

# Set environment variables
ENV VITE_LUMA_KEY=$VITE_LUMA_KEY
ENV VITE_LUMA_SERVER=$VITE_LUMA_SERVER
ENV VITE_VIGGLE_KEY=$VITE_VIGGLE_KEY
ENV VITE_VIGGLE_SERVER=$VITE_VIGGLE_SERVER

RUN npm install pnpm -g

WORKDIR /app

COPY ./package.json /app

COPY ./pnpm-lock.yaml /app

RUN pnpm install

COPY . /app

RUN pnpm run build

# build backend
FROM node:lts as backend

RUN npm install pnpm -g

WORKDIR /app

COPY /service/package.json /app

COPY /service/pnpm-lock.yaml /app

RUN pnpm install

COPY /service /app

RUN pnpm build

# service
FROM node:lts

RUN npm install pnpm -g

WORKDIR /app

COPY /service/package.json /app

COPY /service/pnpm-lock.yaml /app

RUN pnpm install --production && rm -rf /root/.npm /root/.pnpm-store /usr/local/share/.cache /tmp/*

COPY /service /app

COPY --from=frontend /app/dist /app/public

COPY --from=backend /app/build /app/build

EXPOSE 3002

CMD ["pnpm", "run", "prod"]