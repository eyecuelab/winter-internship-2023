# winter-internship-2023

# Super Pac-cart
This is a full stack application that uses prisma and postgresql for the backend, node/express for the server, and react for the front-end and is written using typescript.

## Description

A fun party game where teams of two control karts on a 2d pacman-like map. 

### Technologies Used:
* React
* React Router
* Typescript
* Socket.IO
* Prisma
* PostgreSQL
* ExpressJs
* ViteJS
## Authors

* Helen Lehrer
* Joseph Jackson
* Spencer Dennis
* Patty Otero

##### useful tidbits for dev team:




* run client - npm run dev
* run server - npm start


* env file for database:
DATABASE_URL=postgresql://<USERNAME>:<PASSWORD>@localhost:5432/<DB_NAME>

* db update:
1. delete your local instance of the db
2. npx prisma db push
3. npx prisma db seed







/*
const postExists = await prisma.role.findUnique({
  where: {
    id: 1 
  }
});

if (postExists === null) {*/


/*} else {
  return null;
}*/



fly postgres connect -a super-pacart-db
\c super_pacart
\dt;
SELECT * FROM table_name;


fly postgres connect -a super-pacart-db -> opens postgres
\c super_pacart -> changes the table to super_pacart
\dt; -> lists the tables
SELECT * FROM table_name; -> lists the data of that table
