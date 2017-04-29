#!/bin/bash

rm -R /tmp/webdev
cp -R /webdev /tmp/
find /tmp/webdev/ -iname "node_modules" -exec rm -r {} \;
rm -R /tmp/webdev/user/*
#rm -R /tmp/webdev/user/wellington/workspace/plagiarism/uploads/*

read -p "Enviar para 201.55.32.188? (y/n)" yn
case $yn in
        y ) scp -rp /tmp/webdev/* wellington@201.55.32.188:/webdev;;
        n ) ;;
esac

read -p "Enviar para CASA? (y/n)" yn
case $yn in
        y ) scp -rp /tmp/webdev/* wellington@192.168.0.101:/web;;
        n ) ;;
esac

