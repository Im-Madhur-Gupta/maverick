#!/bin/sh

# Wait for postgres
echo "Waiting for postgres..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL started"

# Run migrations
echo "Running migrations..."
prisma migrate deploy

# Start the app
echo "Starting application..."
exec "$@" 