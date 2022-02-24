import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  block: {
    backgroundColor: "#000",
    width: "20px",
    height: "20px",
  },
  blockSnake: {
    backgroundColor: "#0f0",
  },
  blockfruit: {
    backgroundColor: "#f00",
  },
}));

function Snake() {
  const classes = useStyles();
  const [grid, setgrid] = useState(
    Array(20)
      .fill(0)
      .map((row) => new Array(20).fill(0))
  );
  const [timer, settimer] = useState(100);
  const [snake, setsnake] = useState({
    head: { x: 10, y: 10 },
    pos: [
      { x: 9, y: 10 },
      { x: 10, y: 10 },
    ],
    dir: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      update();
    }, timer);
    document.addEventListener("keydown", keydown, false);
    return () => clearInterval(interval);
  }, []);

  const keydown = (e) => {
    const snakeobj = snake;
    if (e.keyCode == 39 && snakeobj.dir != 3) {
      snakeobj.dir = 1;
    } else if (e.keyCode == 40 && snakeobj.dir != 2) {
      snakeobj.dir = 0;
    } else if (e.keyCode == 37 && snakeobj.dir != 1) {
      snakeobj.dir = 3;
    } else if (e.keyCode == 38 && snakeobj.dir != 0) {
      snakeobj.dir = 2;
    }
  };

  const update = () => {
    move();
    updateGrid();
  };

  const updateGrid = () => {
    let gridobj = Array(20)
      .fill(0)
      .map((row) => new Array(20).fill(0));

    for (const coord of snake.pos) {
      gridobj[coord.x][coord.y] = 1;
    }
    setgrid(gridobj);
  };

  const move = () => {
    let snakeobj = snake;
    let newpos = {};
    switch (snake.dir) {
      case 0:
        newpos = { x: snake.head.x + 1, y: snake.head.y };
        break;
      case 1:
        newpos = { x: snake.head.x, y: snake.head.y + 1 };
        break;
      case 2:
        newpos = { x: snake.head.x - 1, y: snake.head.y };
        break;
      default:
        newpos = { x: snake.head.x, y: snake.head.y - 1 };
    }
    snakeobj.pos.push(newpos);
    snakeobj.pos.shift();
    snakeobj.head = newpos;
    if (
      snake.head.x > 20 ||
      snake.head.x < 0 ||
      snake.head.y > 20 ||
      snake.head.y < 0
    ) {
      resetgame();
    } else {
      setsnake(snakeobj);
    }
  };

  const resetgame = () => {
    let snakeobj = snake;
    snakeobj.head = { x: 10, y: 10 };
    snakeobj.pos = [
      { x: 9, y: 10 },
      { x: 10, y: 10 },
    ];
    snakeobj.dir = 0;
    setsnake(snakeobj);
  };

  const getColor = (val) => {
    if (val === 0) {
      return classes.block;
    } else if (val === 1) {
      return classes.block + " " + classes.blockSnake;
    } else if (val === 2) {
      return classes.block + " " + classes.blockfruit;
    }
  };

  const creategrid = (grid) => {
    return (
      <div>
        <table>
          {grid.map((r) => {
            return (
              <tr>
                {r.map((e) => {
                  return <td className={getColor(e)}></td>;
                })}
              </tr>
            );
          })}
        </table>
      </div>
    );
  };

  return <div>{creategrid(grid)}</div>;
}

export default Snake;
