usage = "\
Usage:	make <option> \n\n\
dev		Local development mode \n\
link		Symlink a package folder \n\
build		Build a package \n\
publish 	Publish a package \n"

default:
	@echo $(usage)

dev:
	yarn tsc --watch -p ./tsconfig.json

link: build
	cd dist && yarn link

build:
	rm -rf dist
	yarn tsc -p ./tsconfig.json
	cp README.md dist/
	cp CHANGELOG dist/
	cp package.json dist/

publish:
	sh release.sh