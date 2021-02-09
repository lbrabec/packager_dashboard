#!/bin/sh
sed -i "s#SUBDIR: '.*',#SUBDIR: '$SUBDIR',#" /app/env.js
sed -i "s#API: '.*'#API: '$API'#" /app/env.js

nginx -g "daemon off;"
