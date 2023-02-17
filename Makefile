start:
	docker-compose up

build:
	docker-compose build

stop:
	docker-compose stop

down:
	docker-compose down


dtest:
	clear && docker-compose run --rm backend sh -c "python manage.py test && flake8"

dlint:
	docker-compose run --rm backend sh -c "flake8"

dcmd:
	docker-compose run --rm backend sh -c "$(c)"

dpmd:
	docker-compose run --rm backend sh -c "python manage.py $(c)"

migration:
	docker-compose run --rm backend sh -c "python manage.py wait_for_db && python manage.py makemigrations && python manage.py migrate"

bdev:
	docker-compose run --rm backend sh -c "python manage.py runserver"

fdev:
	docker-compose run --rm frontend -c "npm run dev"

seed_customer:
	docker-compose run --rm backend sh -c "python manage.py seed_customer --total 50"

seed_pet:
	docker-compose run --rm backend sh -c "python manage.py seed_pet --total 50"


act:
	act --secret-file .secrets -P ubuntu-20.04=catthehacker/ubuntu:full-20.04