FROM gcr.io/bitnami-containers/node:16 as react-build
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build
RUN sed -i "s#SUBDIR: '.*',#SUBDIR: '${SUBDIR:-/}',#" /app/build/env.js && \
    sed -i "s#API: '.*'#API: '${API:-https://packager-dashboard.stg.fedoraproject.org/api/v1/}'#" /app/build/env.js && \
    sed -i "s#APIv2: '.*'#APIv2: '${APIv2:-https://packager-dashboard.stg.fedoraproject.org/api/v2/}'#" /app/build/env.js


FROM gcr.io/bitnami-containers/nginx
COPY nginx.conf /opt/bitnami/nginx/conf/server_blocks/nginx_packager_dashboard.conf
COPY --from=react-build /app/build /app
EXPOSE 8000
