FROM docker.io/bitnami/node:22 as react-build
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build
RUN sed -i "s#SUBDIR: '.*',#SUBDIR: '${SUBDIR:-/}',#" /app/build/env.js && \
    sed -i "s#API: '.*'#API: '${API:-https://packager-dashboard.stg.fedoraproject.org/api/v1/}'#" /app/build/env.js && \
    sed -i "s#APIv2: '.*'#APIv2: '${APIv2:-https://packager-dashboard.stg.fedoraproject.org/api/v2/}'#" /app/build/env.js


FROM docker.io/bitnami/nginx
COPY nginx.conf /opt/bitnami/nginx/conf/server_blocks/nginx_packager_dashboard.conf
COPY --from=react-build /app/build /app
EXPOSE 8000
