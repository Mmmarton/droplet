rm -rf combined.js
cat lib/*.js app/*.js >> combined.js
find ./ -type f -name "combined.js" -exec sed -i -- "s/import.*'\..*//g" {} \;