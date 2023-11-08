#!/usr/bin/env bash

symfony console doctrine:migrations:sync-metadata --no-interaction
symfony console doctrine:migrations:version --add --all --no-interaction
symfony console doctrine:schema:update --force
