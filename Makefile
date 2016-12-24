watch:
	npm install
	@make copy
	npm run build-debug
	npm run watch

build:
	npm install
	@make copy
	npm run build

test:
	npm run test

test-watch:
	npm run testwatch

copy:
	cp node_modules/bootstrap/dist/css/bootstrap.min.css public/css/
	cp node_modules/bootstrap/dist/fonts/* public/fonts/

buildAppForMac:
	make build
	node_modules/electron-packager/cli.js . --platform=darwin --arch=x64 --overwrite

buildApp:
	make build
	node_modules/electron-packager/cli.js . --all --overwrite
