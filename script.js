let engine = Matter.Engine.create({
  bounds: {
    min: { x: 0, y: 0 },
    max: { x: window.innerWidth, y: window.innerHeight },
  },
});

// engine.world.gravity.scale = 0.001;

let render = Matter.Render.create({
  element: document.querySelector("body"),
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
  },
});

let body;
let ctx = render.canvas.getContext("2d");

ctx.font = "20px Times New Roman";
ctx.fillStyle = "skyblue";

ctx.fillText("Lives:3", 20, 20);
ctx.fill();

let ball = Matter.Bodies.circle(400, 500, 20, {
  restitution: 1,
  frictionAir: 0,
  friction: 0,
  slop: 0,
  inertia: Infinity,
  render: {
    fillStyle: "#efefef",
    strokeStyle: "lime",
    lineWidth: 10,
  },
});

Matter.Body.applyForce(
  ball,
  {
    x: ball.position.x,
    y: ball.position.y,
  },
  {
    x: 0.03,
    y: 0,
  }
);

let pad = Matter.Bodies.rectangle(200, window.innerHeight - 100, 200, 10, {
  isStatic: true,
  restitution: 1,
  friction: 0,
  render: {
    fillStyle: "skyblue",
  },
});

let powerUpImage = new Image();
powerUpImage.src = `Untitled.png`;

powerUpImage.onload = function () {
  const canvas = document.createElement("canvas");
  canvas.width = powerUpImage.width;
  canvas.height = powerUpImage.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(powerUpImage, 0, 0);

  body = Matter.Bodies.rectangle(
    Math.floor(Math.random * window.innerWidth),
    -100,
    100,
    100,
    {
      collisionFilter: {
        category: 0.1,
      },
      render: {
        sprite: {
          texture: canvas.toDataURL(),
        },
      },
    }
  );
  Matter.World.add(engine.world, body);

  Matter.Body.applyForce(
    body,
    {
      x: body.position.x,
      y: body.position.y,
    },
    {
      x: 0,
      y: 0.5,
    }
  );
  console.log("hdfklj");
};

let leftBorder = Matter.Bodies.rectangle(0, 0, 20, window.innerHeight * 2, {
  isStatic: true,
  restitution: 1,
  friction: 0,
  render: {
    fillStyle: "blue",
  },
});

let topBorder = Matter.Bodies.rectangle(0, 0, window.innerWidth * 2, 20, {
  isStatic: true,
  restitution: 1,
  friction: 0,
  render: {
    fillStyle: "blue",
  },
});

let bottomBorder = Matter.Bodies.rectangle(
  0,
  window.innerHeight,
  window.innerWidth * 2,
  20,
  {
    isStatic: true,
    restitution: 1,
    friction: 0,
    render: {
      fillStyle: "blue",
    },
  }
);

let rightBorder = Matter.Bodies.rectangle(
  window.innerWidth,
  0,
  20,
  window.innerHeight * 2,
  {
    isStatic: true,
    restitution: 1,
    friction: 0,
    render: {
      fillStyle: "blue",
    },
  }
);

let bricksStack = Matter.Composites.stack(
  200,
  200,
  12,
  4,
  30,
  30,
  function (x, y) {
    return Matter.Bodies.rectangle(x, y, 100, 30, {
      isStatic: true,
      restitution: 1,
      friction: 0,
      render: {
        fillStyle: "orange",
      },
    });
  }
);

document.addEventListener("mousemove", function (event) {
  Matter.Body.setPosition(pad, {
    x: event.clientX,
    y: pad.position.y,
  });
});

Matter.Events.on(engine, "collisionStart", function (e) {
  e.pairs.forEach((pair) => {
    if (
      (pair.bodyA === pad && pair.bodyB === ball) ||
      (pair.bodyA === ball && pair.bodyB === pad)
    ) {
      engine.gravity.scale = 0;
      Matter.Body.setVelocity(ball, {
        x: ball.velocity.x,
        y: ball.velocity.y,
      });
    }
  });
});

Matter.Events.on(engine, "collisionStart", function (e) {
  e.pairs.forEach((pair) => {
    if (pair.bodyA === bottomBorder || pair.bodyB === bottomBorder) {
      location.reload();
    }
  });
});

Matter.World.add(engine.world, [
  pad,
  ball,
  leftBorder,
  topBorder,
  rightBorder,
  bottomBorder,
  bricksStack,
]);

Matter.Events.on(engine, "collisionStart", function (e) {
  e.pairs.forEach((pair) => {
    bricksStack.bodies.forEach((brick) => {
      if (pair.bodyA === brick || pair.bodyB === brick) {
        console.log("hi");
        Matter.Composite.remove(bricksStack, brick);
      }
    });
  });
});

// Matter.Events.on(engine, "collisionStart", function (event) {
//   event.pairs.forEach((pair) => {
//     const { bodyA, bodyB } = pair;
//     if (bodyA === ball || bodyB === ball) {
//       const brickToRemove = bricksStack.bodies.includes(bodyA) ? bodyA : bodyB;
//       if (bricksStack.bodies.includes(brickToRemove)) {
//         Matter.Composite.remove(engine.world, brickToRemove);
//       }
//     }
//   });
// });

Matter.Runner.run(engine);
Matter.Render.run(render);
