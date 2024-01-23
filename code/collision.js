export function circleRectCollision(circle, rect) {
  const circleCenterPosition = {
    x: circle.position.x + circle.radius,
    y: circle.position.y + circle.radius,
  };

  let testX = circleCenterPosition.x;
  let testY = circleCenterPosition.y;

  if (circleCenterPosition.x < rect.position.x)
    testX = rect.position.x; // test left edge
  else if (circleCenterPosition.x > rect.position.x + rects.size.x)
    testX = rect.position.x + rect.size.x; // right edge
  if (circleCenterPosition.y < rect.position.y)
    testY = rect.position.y; // top edge
  else if (circleCenterPosition.y > rect.position.y + rect.size.y)
    testY = rect.position.y + rect.size.y; // bottom edge

  // get distance from closest edges
  let distX = circleCenterPosition.x - testX;
  let distY = circleCenterPosition.y - testY;
  let distance = Math.sqrt(distX * distX + distY * distY);

  // if the distance is less than the radius, collision!
  if (distance <= circle.radius) {
    return true;
  }
  return false;
}

export function circleCircleCollision(circle1, circle2) {
  const distance = Math.sqrt(
    Math.pow(circle1.position.x - circle2.position.x, 2) +
      Math.pow(circle1.position.y - circle2.position.y, 2)
  );

  if (distance <= circle1.radius + circle2.radius) {
    return true;
  }
  return false;
}

export function rectRectCollision(rect1, rect2) {
  const hitboxScale = rect1.hitTolerance;

  const scaledWidth = rect1.size.x * hitboxScale;
  const scaledHeight = rect1.size.y * hitboxScale;

  const scaledX = rect1.position.x + (rect1.size.x - scaledWidth) / 2;
  const scaledY = rect1.position.y + (rect1.size.y - scaledHeight) / 2;

  if (
    scaledX < rect2.position.x + rect2.size.x &&
    scaledX + scaledWidth > rect2.position.x &&
    scaledY < rect2.position.y + rect2.size.y &&
    scaledY + scaledHeight > rect2.position.y
  ) {
    return true;
  }
  return false;
}
