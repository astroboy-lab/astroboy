#!/usr/bin/env sh
set -e
echo "Enter release version: "
read VERSION

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."

  npm version $VERSION --message "[release] $VERSION"

  # publish
  BRANCH=$(git symbolic-ref --short HEAD)
  git push origin $BRANCH
  if [ $BRANCH == 'master' ]
  then
    echo "Add tag v$VERSION"
    git push origin refs/tags/v$VERSION
  fi

  rm -rf dist
  yarn tsc -p ./tsconfig.json
  cp README.md dist/
  cp CHANGELOG dist/
  cp package.json dist/
  cd dist && npm publish
fi
