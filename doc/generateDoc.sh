#!/bin/sh
echo "=== Generating doc ==="
cd ../../../Outils/jsdoc-toolkit-2.0.0
java -jar jsrun.jar app/run.js -c=../../Projets/inputex/doc/inputex.conf ../../Projets/inputex/js
