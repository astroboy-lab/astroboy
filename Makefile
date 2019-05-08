compile:
	rm -rf dist
	tsc
	cp package.json dist/
	cp README.md dist/
	cp CHANGELOG dist/