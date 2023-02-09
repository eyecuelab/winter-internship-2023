import { Boundary, Kart } from "./gameClasses";

//collision detection function:
export function circleCollidesWithRectangle({
  circle,
  rectangle,
}: {
  circle: Kart;
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