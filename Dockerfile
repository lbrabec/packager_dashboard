FROM node:8 as react-build
WORKDIR /app
COPY . ./
RUN chmod -v +x ./start.sh
RUN yarn
RUN yarn build


FROM nginx:alpine
RUN sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html
COPY --from=react-build /app/start.sh /start.sh
EXPOSE 8000
CMD ["/start.sh"]
