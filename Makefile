.PHONY: build deploy

build:
	gulp build

deploy-site:
	rsync -vrc ./site/* mli-field@fielddaylab.wisc.edu:/httpdocs/opengamedata --exclude-from rsync-exclude

deploy-test:
	rsync -vrc ./site/* mli-field@fielddaylab.wisc.edu:/httpdocs/opengamedata-testing --exclude-from rsync-exclude
