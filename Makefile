compile:
	rm -rf dist
	tsc
	cp README.md dist/
	cp CHANGELOG dist/

copy-package:
	cp package.json dist/

build: compile copy-package

publish:
	cd dist && npm publish
