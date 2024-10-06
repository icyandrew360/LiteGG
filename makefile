setup:
	pip install -r requirements.txt
	pre-commit install

precommit-hooks:
	pre-commit run --all-files
