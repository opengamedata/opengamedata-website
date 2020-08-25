.PHONY: build deploy

build:
	gulp styles

deploy:
	rsync -vrc * mli-field@fielddaylab.wisc.edu:/httpdocs/opengamedata --exclude-from rsync-exclude
