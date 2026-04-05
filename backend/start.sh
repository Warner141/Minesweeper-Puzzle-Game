#!/bin/sh
echo "Waiting 15 seconds for database to be ready..."
sleep 15
echo "Running migrations..."
npx prisma migrate deploy
echo "Starting server..."
node app.js