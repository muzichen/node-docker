FROM node:14
WORKDIR /app
COPY package.json .
# RUN npm config set registry https://registry.npm.taobao.org && npm install
ARG NODE_ENV
# RUN echo $NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; then \
      npm config set registry https://registry.npm.taobao.org && npm install; else \
      npm config set registry https://registry.npm.taobao.org  && npm install --only=production;\
      fi;
COPY . .
ENV PORT=300
EXPOSE $PORT
CMD [ "node", "index.js" ]