setup:
	pip install -r requirements.txt
	pre-commit install
	npm install react react-dom @mui/material @emotion/react @emotion/styled
	npm install @fontsource/roboto

precommit-hooks:
	pre-commit run --all-files
