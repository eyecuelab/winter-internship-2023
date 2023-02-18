[deploy]
  # Deploy the Docker image to Fly.
  # Set the max number of instances to 10.
  # Run the Prisma migrate and seed commands as part of the release process.
  max_instances = 10
  release_command = "npx prisma migrate deploy && npx prisma db seed"