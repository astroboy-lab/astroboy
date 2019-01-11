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

  npm publish
fi
