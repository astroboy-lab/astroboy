clean:
	rm -rf dist

compile:
	tsc
	cp README.md dist/
	cp CHANGELOG dist/

re-compile: clean compile

copy-pkg:
	cp package.json dist/

build: re-compile copy-pkg

publish: build
	cd dist && npm publish
