// socket.on("db_update", (data) => {
//   const { gameId, teamId, currentScore, currentKart, currentPellets, currentIsGameOver } = data;

//   // const parsedKart = JSON.parse(currentKart);
//   // console.log(currentKart);
//   // console.log(parsedKart);
//   console.log(gameId);
//   console.log(teamId);
//   console.log(currentScore);
//   console.log(currentKart);
//   console.log(currentIsGameOver);
//   // console.log(currentPellets);


  
//   const gameUpdatesOnInterval = async () => {
//     await prisma.game.update({
//       where: { id: parseInt(gameId) },
//       data: { 
//         // pellets: tempPellets,
//         isActive: currentIsGameOver
//       },
//     })
//   }
//   gameUpdatesOnInterval();
//     // await prisma.team.update({
//     //   where: { id: teamId },
//     //   data: { 
//     //     score: tempScore,
//     //     position:  parsedKart["position"],
//     //     velocity:  parsedKart["velocity"],
//     //     angle: parsedKart["angle"]
//     //   },
//     // })

//   console.count("db_update");
// })

// setInterval(async () => {
//   const currentScore = roomGameRef.current.scores.get(myGameRef.current.myTeam.color)
//   const currentKart =  roomGameRef.current.karts.get(
//     myGameRef.current.myTeam.color
//   );
//   const currentIsGameOver = roomGameRef.current.isGameOver;
//   const currentPellets = pelletsRef.current;

//   console.log("color:" + myGameRef.current.myTeam.color)
//   console.log(" currentScore" + currentScore);
//   console.log("currentKart" + currentKart);
//   console.log("teamId" + teamId.current);
//   console.log("currentIsGameOver" + currentIsGameOver);


//   socket.emit("db_update", {
//     gameId, teamId, currentScore, currentKart, currentPellets, currentIsGameOver
//   })
// }, 10000);