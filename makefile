setup:
	pip install -r requirements.txt
	pre-commit install

frontend-dev:
	cd app
	npm install
	npm install @fontsource/roboto

frontend-preview:
	cd app
	npm run dev

precommit-hooks:
	pre-commit run --all-files
