document.addEventListener("DOMContentLoaded", () => {

  const grid = document.querySelector(".grid");
  const scoreDisplay = document.getElementById("score1");
  const para = document.getElementById("para");

  let width = 4;
  let boxes = [];
  let score = 0;

  // Create grid
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      let tile = document.createElement("div");
      tile.innerHTML = 0;
      tile.classList.add("tile-0");
      grid.appendChild(tile);
      boxes.push(tile);
    }
    generate();
    generate();
  }

  function generate() {
    let empty = boxes.filter(b => b.innerHTML == 0);
    if (empty.length === 0) return;

    let random = empty[Math.floor(Math.random() * empty.length)];
    random.innerHTML = 2;
    updateColors();
  }

  function updateColors() {
    boxes.forEach(box => {
      box.className = "";
      box.classList.add("tile-" + box.innerHTML);
    });
  }

  function moveLeft() {
    for (let i = 0; i < 16; i += 4) {
      let row = boxes.slice(i, i + 4).map(b => +b.innerHTML).filter(n => n);
      while (row.length < 4) row.push(0);
      row.forEach((n, j) => boxes[i + j].innerHTML = n);
    }
  }

  function moveRight() {
    for (let i = 0; i < 16; i += 4) {
      let row = boxes.slice(i, i + 4).map(b => +b.innerHTML).filter(n => n);
      while (row.length < 4) row.unshift(0);
      row.forEach((n, j) => boxes[i + j].innerHTML = n);
    }
  }

  function moveUp() {
    for (let i = 0; i < 4; i++) {
      let col = [0,1,2,3].map(j => +boxes[i + j * 4].innerHTML).filter(n => n);
      while (col.length < 4) col.push(0);
      col.forEach((n, j) => boxes[i + j * 4].innerHTML = n);
    }
  }

  function moveDown() {
    for (let i = 0; i < 4; i++) {
      let col = [0,1,2,3].map(j => +boxes[i + j * 4].innerHTML).filter(n => n);
      while (col.length < 4) col.unshift(0);
      col.forEach((n, j) => boxes[i + j * 4].innerHTML = n);
    }
  }

  function combineRow() {
    for (let i = 0; i < 15; i++) {
      if (boxes[i].innerHTML !== "0" &&
          boxes[i].innerHTML === boxes[i + 1].innerHTML &&
          (i + 1) % 4 !== 0) {

        let sum = +boxes[i].innerHTML * 2;
        boxes[i].innerHTML = sum;
        boxes[i + 1].innerHTML = 0;
        score += sum;
      }
    }
    scoreDisplay.innerHTML = score;
  }

  function combineColumn() {
    for (let i = 0; i < 12; i++) {
      if (boxes[i].innerHTML !== "0" &&
          boxes[i].innerHTML === boxes[i + 4].innerHTML) {

        let sum = +boxes[i].innerHTML * 2;
        boxes[i].innerHTML = sum;
        boxes[i + 4].innerHTML = 0;
        score += sum;
      }
    }
    scoreDisplay.innerHTML = score;
  }

  function keyLeft() { moveLeft(); combineRow(); moveLeft(); generate(); }
  function keyRight() { moveRight(); combineRow(); moveRight(); generate(); }
  function keyUp() { moveUp(); combineColumn(); moveUp(); generate(); }
  function keyDown() { moveDown(); combineColumn(); moveDown(); generate(); }

  // Swipe
  let sx, sy, ex, ey;

  grid.addEventListener("touchstart", e => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  });

  grid.addEventListener("touchend", e => {
    ex = e.changedTouches[0].clientX;
    ey = e.changedTouches[0].clientY;
    handleSwipe();
  });

  grid.addEventListener("mousedown", e => {
    sx = e.clientX;
    sy = e.clientY;
  });

  grid.addEventListener("mouseup", e => {
    ex = e.clientX;
    ey = e.clientY;
    handleSwipe();
  });

  function handleSwipe() {
    let dx = ex - sx;
    let dy = ey - sy;

    if (Math.abs(dx) > Math.abs(dy)) {
      dx > 30 ? keyRight() : dx < -30 && keyLeft();
    } else {
      dy > 30 ? keyDown() : dy < -30 && keyUp();
    }
    updateColors();
  }

  createBoard();
});
