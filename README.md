
# How to run project
- First you need to run this command to create the instance of the database: `docker-compose up -d`

- install nodemon: `npm install nodemon`
- install dependencies: `npm install`
- you need to migrate the schema of prisma to the db: `npx prisma db push`
- you can run the proyect: `nodemon scr/index.ts`