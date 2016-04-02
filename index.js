const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const WIDTH = 500
const HEIGHT = 500
console.log(ctx)
canvas.width = WIDTH
canvas.height = HEIGHT



function areColliding(obj1, obj2) {
  let widest = obj1;
  let thinnest = obj2;
  if (obj2.w > obj1.w ) {
    widest = obj2;
    thinnest = obj1;
  }

  let longest = obj1
  let shortest = obj2
  if (obj2.h > obj1.h) {
    longest = obj2
    shortest = obj1
  }

  return (
    contains(widest.x, thinnest.x             , widest.x + widest.w) ||
    contains(widest.x, thinnest.x + thinnest.w, widest.x + widest.w)
  ) && (
    contains(longest.y, shortest.y             , longest.y + longest.h) ||
    contains(longest.y, shortest.y + shortest.h, longest.y + longest.h)
  )
}

let keyHash = {
  up: false,
  down: false
}
document.addEventListener("keydown", e =>  {
  switch (e.code) {
  case "ArrowUp":
    keyHash.up = true
    break
  case "ArrowRight":
    keyHash.right = true
    break

  case "ArrowLeft":
    keyHash.left = true
    break
  }
  //console.log(e)
})
document.addEventListener("keyup", e => {

  switch (e.code) {
  case "ArrowUp":
    keyHash.up = false
    break
  case "ArrowRight":
    keyHash.right = false
    break

  case "ArrowLeft":
    keyHash.left = false
    break
  }
})

class Floor {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }
}

class Platform {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }
}

class Player {
  constructor(x, y, w, h) {
    this._x = x
    this.xPrev = x
    this._y = y
    this.yPrev = y
    this.w = w
    this.h = h

    this.a = 0
    this._vy = 0
    this.vx = 0

    this.jumpCounter = 0
    this.keys = {}
    this.isJumping = false
  }


  set x(x) {
    this.xPrev = this._x
    this._x = x
  }

  get x() {
    return this._x
  }

  set y(y) {
    this.yPrev = this._y
    this._y = y
  }

  get y() {
    return this._y
  }

  set vy(vy) {
    if (vy === 0 && this._vy > 0) {
      this.isJumping = false
      this.jumpCounter = 0
    }
    this._vy = vy
  }

  get vy() {
    return this._vy
  }

  jump() {
    this.vy = -300
    this.jumpCounter++
    this.isJumping = true
  }

  canJump() {
    return !this.isJumping || (this.isJumping && this.jumpCounter <= 30)
  }


  setKeys(newKeys) {
    if (this.canJump()) {
      if (keyHash.up) {
        this.jump()
      } else {
        this.jumpCounter = 1000
      }
    }

    if (keyHash.right) {
      this.vx = 200
    } else if (keyHash.left) {
      this.vx = -200
    } else if (!keyHash.right && !keyHash.right) {
      this.vx = 0
    }


    this.keys = newKeys


  }
}



let player = new Player(200, 0, 30, 50)
let floor = new Floor(0, 400, WIDTH, HEIGHT)
let platform = new Platform(300, 250, 100, 50)

const GRAVITY = 900
const DT = 1/60

const contains = (x0, x1, x2) => x0 < x1 && x1 < x2

function render() {
  console.log("Render exec")
  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  // Controls
  player.setKeys(keyHash)

  // Player cinematics
  player.a = GRAVITY
  player.vy += player.a * DT
  player.y += player.vy * DT
  player.x += player.vx * DT



  // Collitions
  if (
    (
      contains(floor.x, player.x, floor.x + floor.w) ||
      contains(floor.x, player.x + player.w, floor.x + floor.w)
    ) && (
      contains(floor.y, player.y, floor.y + floor.h) ||
      contains(floor.y, player.y + player.h, floor.y + floor.h)
    )
  ) {

    // The velocity has direction information
    if (player.vy > 0) {
      //top collition
      player.y = floor.y - player.h
    } else {
      console.log("TBD")
    }
    player.a = 0
    player.vy = 0
  }


  if (areColliding(platform, player)) {
    if (player.vx > 0) {
      if (player.xPrev + player.w <= platform.x && player.x + player.w > platform.x) {
        console.log("right collition") 
        player.vx = 0
        player.x = platform.x - player.w
      }
    } else if (player.vx < 0) {
      if (player.xPrev >= platform.x + platform.w && player.x < platform.x + platform.w) {
        console.log("left collition")
        player.vx = 0
        player.x = platform.x + platform.w
      }
    }

    if (player.vy > 0) {
      if (player.yPrev + player.h <= platform.y && player.y + player.h > platform.y) {
        console.log("bottom collition")
        player.a = 0
        player.vy = 0
        player.y = platform.y - player.h
      }
    } else if (player.vy < 0) {
      if (player.yPrev >= platform.y + platform.h && player.y < platform.y + platform.h) {
        console.log("top collition")
        player.a = 0
        player.vy = 0
        player.y = platform.y + platform.h
      }
    }


  }


  ctx.fillStyle = "blue"
  ctx.fillRect(floor.x, floor.y, floor.w, floor.h)

  ctx.fillStyle = "green"
  ctx.fillRect(platform.x, platform.y, platform.w, platform.h)

  ctx.fillStyle = "red"
  ctx.fillRect(player.x, player.y, player.w, player.h)


  window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)

