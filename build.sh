rm -rf combined.js
cat lib/components.js lib/dom.js app/*.js lib/main.js >> combined.js
find ./ -type f -name "combined.js" -exec sed -i -- "s/import.*'\..*//g" {} \;