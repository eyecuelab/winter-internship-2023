import { Kart } from "./gameClasses";
import { kartType } from "../../types/Types";

export function ghostCollidesWithKart({
  ghost,
  paCart,
}: {
  ghost: Kart;
  paCart: Kart;
}) {
  const dx = ghost.position.x - paCart.position.x;
  const dy = ghost.position.y - paCart.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const radiusSum = ghost.radius + paCart.radius;
  return distance <= radiusSum;
}
