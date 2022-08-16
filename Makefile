.PHONY: build deploy

build:
	gulp styles

# deploy-site:
# 	rsync -vrc ./site/* mli-field@fielddaylab.wisc.edu:/httpdocs/opengamedata --exclude-from rsync-exclude

deploy-test:
	rsync -vrc ./build/* mli-field@fielddaylab.wisc.edu:/httpdocs/opengamedata-testing --exclude-from rsync-exclude

deploy-redirect:
	rsync -vrc ./redirects/* fieldday-web.ad.education.wisc.edu:/var/www/opengamedata --exclude-from rsync-exclude
