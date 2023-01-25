import usersControllers from '../Controllers/users';

const express = require( "express" );


const router = express.Router();

router.get('/games/:id', gamesControllers.getGameById);

export default router; 