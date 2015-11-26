start: fix
	npm run start

test:
	npm run test

test-watch:
	npm run testwatch

build:
	npm run build
	cp node_modules/bootstrap/dist/css/bootstrap.min.css public/css/
	cp node_modules/bootstrap/dist/fonts/* public/fonts/

fix:
	ulimit -n 2560
