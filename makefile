setup:
	pip install -r requirements.txt
	pre-commit install

frontend-dev:
	cd app
	npm install
	npm install @fontsource/roboto

precommit-hooks:
	pre-commit run --all-files
