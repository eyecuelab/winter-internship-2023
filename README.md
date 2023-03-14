# _Winter Internship 2023_

## 🧑🏽‍🤝‍🧑🏼 Creators

Deployed Application: [https://super-pacart.netlify.app/](https://super-pacart.netlify.app/)

- Joseph Jackson
- Helen Lehrer
- Patty Otero
- Spencer Dennis

## 📂 Table Of Contents

- [Description](#description)
  - [Summary](#summary)
  - [MVP](#mvp)
  - [Stretch Goals](#stretch-goals)

- [Technologies Used](#technologies-used)
- [Installation, Setup, and Running The App](#installation-setup-and-running-the-app)
  - [Installation](#installation)
  - [Required Files](#required-files)
  - [Running The App Locally](#running-the-app-locally)
- [Bugs](#bugs)
- [License](#license)

## 📝 Summary <a id="summary"></a>

_This is a full stack application that uses prisma and postgresql for the database, node/express for the server, and react for the front-end. It is written using typescript and utilizes Socket.IO for real-time game play with mutliple players from different computers._

## ✅ Description <a id="description"></a>

#### General Instructions:
_This is a web application that will allow a group of users to play a PacMan/Mario Cart inspired game. The objective of the game is for PacMan controlled carts to collect all pellets on the map. Each cart in the game is controlled by two players, one player will control up and down using the "W" and "S" keys, and the other teammate will control left and right using "A" and "D" keys. Control of the cart toggles between teammates after each move has been made. If you are playing as a Ghost on spawn, your objective is to take down the PacMan cart. When a Ghost catches a PacMan, The Ghost then becomes a PacMan cart allowing them to start collecting pellets. The caught PacMan now becomes a ghost and has to try and get catch a PacMan cart. The game ends when all of the pellets on the map have been collected. Whichever team has the highest score in the end is the winner!_

## 🎯 MVP <a id="mvp"></a>

✅ Users can login via Google Auth

✅ Clicking "join a public game" button will send users to game rooms until they are filled, and then create new games as needed.

✅ Game can accomodate 4 players on 2 teams.

✅+ The map will be hard coded and not randomly generated, with 2 spawn points.

✅ When carts eat pellets, they gain points and the pellets disappear.

✅+  All carts are pacman carts.

✅ Players control cars with WASD keys.

✅ Carts cannot move backwards and have inertia.

✅ When a player disconnects the game will end.

✅ When pellets run out, the game is over.

✅ When a game is over, all players will see the final scores and be able to click a button to return to the home screen.

### ⭐ Stretch Goals <a id="stretch-goals"></a>

❌ One-player/demo mode

✅ maps are randomly generated

❌ Chat/messenger

❌ Customizable colors for Pacarts/Ghosts

❌ Power-ups are viable based on different factors

✅ Camera focused on the player and can move around

❌ Choose size on the map

❌ Rounds

❌ Collection of maps

❌ Waiting Room with setting, sharable game links

✅ Multiple games happening simultaneously

❌ Carts have different stats: top speed, handling

✅ Having up to eight players in one game

❌ Leader-boards

✅ Smart respawn: Characters respawn based on the location of capture

❌ Option the rematch with the same players

## 🖥️ Technologies Used <a id="technologies-used"></a>

- _[React](https://reactjs.org/)_
- _[React Router](https://reactrouter.com/)_
- _[Typescript](https://www.typescriptlang.org/)_
- _[Socket.IO](https://socket.io/)_
- _[Prisma](https://www.prisma.io/)_
- _[PostgreSQL](https://www.postgresql.org/)_
- _[ExpressJs](https://expressjs.com/)_
- _[ViteJS](https://vitejs.dev/)_
- _[Nodemon](https://www.npmjs.com/package/nodemon)_
- _[Fly.IO](https://fly.io/)_

## ⚙️ Installation, Setup, and Running The App <a id="installation-setup-and-running-the-app"></a>

### Setup/Installation Requirements <a id="installation"></a>

- _Please ensure you have the latest version of NodeJs and PostgreSQL_
- _Clone this repository <https://github.com/eyecuelab/winter-internship-2023/tree/main> locally_
- _Navigate to the root folder `winter-internship-2023` and then `cd server` and run `npm install` and then `cd client` and run `npm install`_.
- See below for required .env files
- You will also need to have your database setup in PostgreSQL
- To ensure the prisma schema has been updated to PostgreSQL, Run a migration to create your database tables with Prisma Migrate:
  - `npx prisma migrate dev --name init`
  - `npm run seed` to seed the database with the default roles
- Also, Prisma Studio is a visual editor for the data in your database.
  - Run `npx prisma studio` in your terminal.

### Required .env Files <a id="required-files"></a>

- In the `/server` directory, create an .env file and insert the following: `DATABASE_URL="postgresql://postgres:yourPasswordGoesHere@localhost:5432/yourDatabaseNameGoesHere?schema=yourSchemaNameGoesHere"`
- Then save
- In the `/client` directory, create an .env file (separate from the previous), and insert the following: `VITE_API_ENDPOINT=http://localhost:3000`
- Then save

### Running the App Locally <a id="running-the-app-locally"></a>

- Split your terminal into two separate consoles
- Navigate one terminal into the `/server` directory and run `npm start`
- Navigate the second terminal into the `/client` directory and run `npm run dev`. If your browser does not automatically load, type `http://localhost:3000/` manually in the browser


## Known 🐛 Bugs <a id="bugs"></a>

- _No Known Issues_

## 🎫License <a id="license"></a>

[MIT](LICENSE) 👈

_If you run into any issues or have questions, ideas, or concerns;  please email us!_

Copyright (c) 2022 Joseph Jackson - Helen Lehrer - Patty Otero - Spencer Dennis
