import { Kart } from "./gameClasses";
import { kartType } from "../../types/Types";

export function circleCollidesWithCircle({
  ghost,
  paCart,
}: {
  ghost: Kart;
  paCart: Kart;
}) {
  return (
    //this function tests to see if the edge of the circle will hit a boundary
    //should we check to see if edges touch edges, edges touch the center, or center touches the center? probably the 1st one?
    //pacman does it so that center of the ghost touches the edge of pacman and vice versa (the center of pacman touches the edge of the ghost)

    //attempt 1, just emit true if the centers are overlapped
    ghost.position.x === paCart.position.x && ghost.position.y === paCart.position.y


    /*
    circle.position.y - circle.radius + circle.velocity.y <=
      rectangle.position.y + Boundary.height &&
    circle.position.x + circle.radius + circle.velocity.x >=
      rectangle.position.x &&
    circle.position.y + circle.radius + circle.velocity.y >=
      rectangle.position.y &&
    circle.position.x - circle.radius + circle.velocity.x <=
      rectangle.position.x + Boundary.width
      */
     //false
  );
}

/*
export function circleCollidesWithRectangle({
  circle,
  rectangle,
}: {
  circle: kartType;
  rectangle: Boundary;
}) {
  return (
    circle.position.y - circle.radius + circle.velocity.y <=
      rectangle.position.y + Boundary.height &&
    circle.position.x + circle.radius + circle.velocity.x >=
      rectangle.position.x &&
    circle.position.y + circle.radius + circle.velocity.y >=
      rectangle.position.y &&
    circle.position.x - circle.radius + circle.velocity.x <=
      rectangle.position.x + Boundary.width
  );
}
*/