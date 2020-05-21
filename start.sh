#!/bin/sh
sed -i "s#SUBDIR: '.*',#SUBDIR: '$SUBDIR',#" /usr/share/nginx/html/env.js
sed -i "s#API: '.*'#API: '$API'#" /usr/share/nginx/html/env.js

nginx -g "daemon off;"
