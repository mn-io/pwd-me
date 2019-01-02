#!/bin/bash

# usage: ./deploy.sh <ssh host>:<web dir> <url path>

npx json -I -f package.json -e "this.homepage=\"/${2}\""

npm run build

npx json -I -f package.json -e "this.homepage=\"\""

rsync -avhe ssh --progress build/ ${1}/${2}
