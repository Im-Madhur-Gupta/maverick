#!/bin/sh

# Extract host from DATABASE_URL
DB_HOST=$(echo $DATABASE_URL | sed -n 's|.*//.*@\(.*\):.*|\1|p')

# Wait for postgres
echo "Waiting for DB at $DB_HOST..."
while ! nc -z $DB_HOST 5432; do
  sleep 1
done
echo "DB ready"

# Run migrations
echo "Running migrations..."
prisma migrate deploy

# Start the app
echo "Starting application..."
exec "$@" 