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

_This is a full-stack application that uses Prisma/PostgreSQL for the database, Node.js/Express for the server, and React for the front-end. It is written in Typescript and utilizes Socket.io for real-time game play with mutliple players from different computers._

## ✅ Description <a id="description"></a>

#### General Instructions:
_Get ready for an exciting gaming experience with our web application inspired by Pac-Man and Mario Kart! This multiplayer game allows a group of up to 8 users to control Pac-Man and Ghost karts, with each kart controlled by two players. One teammate controls up and down using the "W" and "S" keys, while the other controls left and right using "A" and "D" keys. Control of the kart switches between teammates after each move, requiring strategic planning and seamless coordination.

If you are on a Pac-Man kart, your objective is to collect all pellets scattered across the map. But be warned! If you're a Ghost, your goal is to take down the Pac-Man kart. When a Ghost catches a Pac-Man, the Ghost transforms into a Pac-Man kart and begins collecting pellets. The captured Pac-Man becomes a Ghost and must try to catch a Pac-Man kart.

However, Ghost karts do not collect pellets but receive points for catching a Pac-Man. The game continues until all pellets on the map have been collected, and the team with the highest score at the end is declared the winner!

Are you ready to take on the challenge and compete against your friends in this fast-paced multiplayer game? Join us and experience the thrill of the race as you maneuver through the map and outsmart your opponents!_

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
- For locally testing this particular game, you will need to open 2 browser windows to have 2 unique users enter the game, as the game will not run or be playable until at least 2 people have entered.


## Known 🐛 Bugs <a id="bugs"></a>

- _No Known Issues_

## 🎫License <a id="license"></a>

[MIT](LICENSE) 👈

_If you run into any issues or have questions, ideas, or concerns;  please email us!_

Copyright (c) 2022 Joseph Jackson - Helen Lehrer - Patty Otero - Spencer Dennis
