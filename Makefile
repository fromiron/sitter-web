start:
	docker-compose up

build:
	docker-compose build

stop:
	docker-compose stop
	
down:
	docker-compose down


dtest:
	docker-compose run --rm backend sh -c "python manage.py test && flake8"

dlint:
	docker-compose run --rm backend sh -c "flake8"

dcmd:
	docker-compose run --rm backend sh -c "$(c)"

dpmd:
	docker-compose run --rm backend sh -c "python manage.py $(c)"

migration:
	docker-compose run --rm backend sh -c "python manage.py wait_for_db && python manage.py makemigrations && python manage.py migrate"