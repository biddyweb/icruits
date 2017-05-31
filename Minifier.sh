#!/usr/bin/env bash
#############################################################
#  Created by einjel on 4/22/17.
#############################################################

rm -f web/static/js/init/controllers.min.js
uglifyjs web/static/js/init/controllers.js -o web/static/js/init/controllers.min.js -c -m
rm -f web/static/js/init/main.min.js
uglifyjs web/static/js/init/main.js -o web/static/js/init/main.min.js -c -m
#rm -f web/static/js/init/routes.min.js
#uglifyjs web/static/js/init/routes.js -o web/static/js/init/routes.min.js -c -m
rm -f web/static/js/init/services.min.js
uglifyjs web/static/js/init/services.js -o web/static/js/init/services.min.js -c -m
rm -f web/static/js/js-main.min.js
uglifyjs web/static/js/js-main.js -o web/static/js/js-main.min.js -c -m
rm -f web/static/style/css/main.min.css
uglifycss web/static/style/css/main.css > web/static/style/css/main.min.css
rm -f web/static/style/css/responsive.min.css
uglifycss web/static/style/css/responsive.css > web/static/style/css/responsive.min.css
