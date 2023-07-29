echo "Making The Migrations"
python manage.py makemigrations

echo "Migrating The Migrations"
python manage.py migrate


echo "Run The Server"
python manage.py runserver 1200
