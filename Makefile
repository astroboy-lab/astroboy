compile:
	rm -rf dist
	tsc
	cp README.md dist/
	cp CHANGELOG dist/

copy-pkg:
	cp package.json dist/

build: compile copy-pkg

publish: build
	cd dist && npm publish
