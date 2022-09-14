#!/bin/bash
PROJECT_DIR=${HOME}/omniflix/insync-test/insync
if [[ ! -d ${PROJECT_DIR} ]]; then
  cd "${HOME}/insync-test" &&
    git clone git@github.com:OmniFlix/insync.git
fi

cd "${PROJECT_DIR}" &&
  git stash &&
  git checkout development &&
  git pull origin development &&
  yarn &&
  yarn build &&
  mkdir -p /var/www/insync-flixnet &&
  sudo rm -rf /var/www/insync-flixnet/* &&
  sudo mv "${PROJECT_DIR}"/build/ /var/www/insync-flixnet/
