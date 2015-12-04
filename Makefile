watch:
	@make fix
	npm install
	@make copy
	npm run build-debug
	npm run watch

build:
	@make fix
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

fix:
	ulimit -n 2560
