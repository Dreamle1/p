import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const gridsize = { x: 20, y: 20 };

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
  const [timer, settimer] = useState(200);
  const [fruit, setfruit] = useState({ x: 0, y: 0 });
  const [snake, setsnake] = useState({
    head: { x: 10, y: 10 },
    pos: [
      { x: 9, y: 10 },
      { x: 10, y: 10 },
    ],
    dir: 0,
  });
  const [keydir, setkeydir] = useState(0);

  useEffect(() => {
    resetfruit();
    const interval = setInterval(() => {
      update();
    }, timer);
    document.addEventListener("keydown", keydown, false);
    return () => {
      clearInterval(interval);
      document.removeEventListener("keydown", keydown, false);
    };
  }, []);

  const resetfruit = () => {
    setfruit((fruit) => {
      fruit.x = Math.floor(Math.random() * (gridsize.x - 1));
      fruit.y = Math.floor(Math.random() * (gridsize.y - 1));
      return fruit;
    });
  };

  const keydown = (e) => {
    if (e.keyCode === 39) {
      setkeydir(1); //right
    } else if (e.keyCode === 40) {
      setkeydir(0); //down
    } else if (e.keyCode === 37) {
      setkeydir(3); //left
    } else if (e.keyCode === 38) {
      setkeydir(2); //up
    }
  };

  const update = () => {
    move();
  };

  useEffect(() => {
    setsnake((s) => {
      if (
        (s.dir !== 3 && keydir === 1) ||
        (s.dir !== 2 && keydir === 0) ||
        (s.dir !== 1 && keydir === 3) ||
        (s.dir !== 0 && keydir === 2)
      )
        return { ...s, dir: keydir };
      return s;
    });
  }, [keydir]);

  useEffect(() => {
    if (
      snake.head.x > gridsize.x - 1 ||
      snake.head.x < 0 ||
      snake.head.y > gridsize.y - 1 ||
      snake.head.y < 0
    ) {
      resetgame();
      return;
    }
    if (snake.head.x === fruit.x && snake.head.y === fruit.y) {
      console.log("yummy");
      resetfruit();
    }
    updateGrid();
  }, [snake]);

  const updateGrid = () => {
    setgrid((grid) => {
      grid = Array(20)
        .fill(0)
        .map((row) => new Array(20).fill(0));
      grid[fruit.x][fruit.y] = 2;
      for (const coord of snake.pos) {
        grid[coord.x][coord.y] = 1;
      }
      let newgrid = [...grid];
      return newgrid;
    });
  };

  const move = () => {
    setsnake((prevsnake) => {
      let newpos = {};
      let newsnake = Object.assign({}, prevsnake);
      newsnake.pos = [...prevsnake.pos];
      switch (newsnake.dir) {
        case 0:
          newpos = { x: newsnake.head.x + 1, y: newsnake.head.y };
          break;
        case 1:
          newpos = { x: newsnake.head.x, y: newsnake.head.y + 1 };
          break;
        case 2:
          newpos = { x: newsnake.head.x - 1, y: newsnake.head.y };
          break;
        default:
          newpos = { x: newsnake.head.x, y: newsnake.head.y - 1 };
      }
      newsnake.pos.push(newpos);
      if (newpos.x === fruit.x && newpos.y === fruit.y) {
      } else {
        newsnake.pos.shift();
      }
      newsnake.head = newpos;
      return newsnake;
    });
  };

  const resetgame = () => {
    setsnake((snake) => {
      snake.head = { x: 10, y: 10 };
      snake.pos = [
        { x: 9, y: 10 },
        { x: 10, y: 10 },
      ];
      snake.dir = 0;
      return snake;
    });
    resetfruit();
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
