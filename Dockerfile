# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.1.12-alpine as base
WORKDIR /usr/src/app
ENV NODE_ENV=production

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json /temp/dev/
RUN cd /temp/dev && bun install 
RUN cd /temp/dev && bun install --frozen-lockfile

FROM base AS prerelease
RUN mkdir -p /temp/prod
COPY package.json /temp/prod/
COPY --from=install /temp/dev/bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --production

# copy production dependencies and source code into final image
FROM base AS release
ENV PORT=3000
COPY --from=prerelease /temp/prod/node_modules node_modules
COPY . .

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]