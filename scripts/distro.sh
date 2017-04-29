#!/bin/bash

#rm -R /distro/nodejsdev
mkdir /distro/nodejsdev
cp -R /webdev/ide/* /distro/nodejsdev/
cp -R /webdev/ide/.config /distro/nodejsdev/.config

find /distro/nodejsdev/ -iname "node_modules" -exec rm -r {} \;
rm /distro/nodejsdev/.config/users
mv /distro/nodejsdev/.config/users_template /distro/nodejsdev/.config/users
mv /distro/nodejsdev/.config/groups_template /distro/nodejsdev/.config/groups

rm -R /distro/nodejsdev/uploads
