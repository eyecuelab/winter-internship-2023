import { Boundary } from "./gameClasses";
import { kartType } from "../../types/Types";

//collision detection function:
export function kartCollidesWithBoundary({
  circle,
  rectangle,
}: {
  circle: kartType;
  rectangle: Boundary;
}) {
  const willCollide =
    circle.position.y - circle.radius + circle.velocity.y <=
      rectangle.position.y + Boundary.height &&
    circle.position.x + circle.radius + circle.velocity.x >=
      rectangle.position.x &&
    circle.position.y + circle.radius + circle.velocity.y >=
      rectangle.position.y &&
    circle.position.x - circle.radius + circle.velocity.x <=
      rectangle.position.x + Boundary.width;

  return willCollide;
}
