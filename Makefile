compile:
	rm -rf dist
	tsc
	cp README.md dist/
	cp CHANGELOG dist/

copy-package:
	cp package.json dist/

build: compile copy-package

publish-only:
	cd dist && npm publish

publish: compile
	npx bmpub publish --config publish.config.json

beta: compile
	npx bmpub publish --config publish.beta.json