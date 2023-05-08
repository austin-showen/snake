/**
 * Snakes in Space
 *
 * Author: Austin Showen
 * Date: 05/05/2023
 *
 * Background image: "Galaxy" by Andy Holmes, https://unsplash.com/photos/rCbdp8VCYhQ
 * Sound effects: https://mixkit.co
 **/

/* +-+-+-+- CONSTANTS -+-+-+-+ */

const WIDTH = 15
const HEIGHT = 15
const TAIL_START_LENGTH = 2
const TICKSPEED_START = 300
const COLORS = {
  snake: 'var(--snake-color)',
  food: 'var(--food-color)',
  cell: 'var(--cell-color)'
}
const KEYCODES = {
  38: 'u',
  87: 'u',
  39: 'r',
  68: 'r',
  40: 'd',
  83: 'd',
  37: 'l',
  65: 'l'
}
const DIRECTIONS = {
  u: {
    x: 0,
    y: -1,
    opposite: 'd',
    rotation: 0,
    nextDirectionRotation: {
      l: 270,
      r: 180
    }
  },
  r: {
    x: 1,
    y: 0,
    opposite: 'l',
    rotation: 90,
    nextDirectionRotation: {
      u: 0,
      d: 270
    }
  },
  d: {
    x: 0,
    y: 1,
    opposite: 'u',
    rotation: 180,
    nextDirectionRotation: {
      l: 0,
      r: 90
    }
  },
  l: {
    x: -1,
    y: 0,
    opposite: 'r',
    rotation: 270,
    nextDirectionRotation: {
      u: 90,
      d: 180
    }
  }
}

/* +-+-+-+- AUDIO -+-+-+-+ */
const audioSoftClick = new Audio('assets/softclick.wav')
audioSoftClick.volume = 0.3
const audioChime = new Audio('assets/chime.wav')
const audioGameOver = new Audio('assets/gameover.wav')
const audioSpeedUp = new Audio('assets/speedup.wav')

/* +-+-+-+- STATE VARIABLES -+-+-+-+ */
let tailLength
let currentDirection
let prevDirection
let currentLocation
let tail
let foodLocation
let score
let highScore
let alive
let moveQueued
let tickspeed
let messageText

/* +-+-+-+- HTML ELEMENTS -+-+-+-+ */
const boardEl = document.querySelector('#board')
const currentScoreEl = document.querySelector('#current-score')
const highScoreEl = document.querySelector('#high-score')
const messageEl = document.querySelector('#message')

/* +-+-+-+- FUNCTIONS -+-+-+-+ */

const createBoard = () => {
  boardEl.innerHTML = ''
  for (let row = 0; row < WIDTH; row++) {
    for (let col = 0; col < HEIGHT; col++) {
      const newCell = document.createElement('div')
      newCell.id = `r${row}c${col}`
      newCell.style.backgroundColor = COLORS.cell
      boardEl.appendChild(newCell)
    }
  }
}

const newFood = () => {
  if (foodLocation) clearCell(foodLocation)
  const foodRow = Math.floor(Math.random() * HEIGHT)
  const foodCol = Math.floor(Math.random() * WIDTH)
  foodLocation = {
    x: foodCol,
    y: foodRow
  }
}

const renderFood = () => {
  const foodCellEl = document.querySelector(
    `#r${foodLocation.y}c${foodLocation.x}`
  )
  foodCellEl.style.backgroundColor = COLORS.food
}

const renderSnake = () => {
  const snakeEl = document.querySelector(
    `#r${currentLocation.y}c${currentLocation.x}`
  )
  snakeEl.innerHTML = `<img src='../assets/ship.png' class='rotate${DIRECTIONS[currentDirection].rotation}'>`
}

const renderMessage = () => {
  messageEl.innerText = `Eat the food! Avoid your tail!\n${messageText}`
}

const render = () => {
  renderFood()
  renderSnake()
  renderMessage()
}

const clearCell = (loc) => {
  const cellEl = document.querySelector(`#r${loc.y}c${loc.x}`)
  cellEl.style.backgroundColor = COLORS.cell
  cellEl.innerHTML = ''
}

const compareLocations = (loc1, loc2) => {
  return loc1.x === loc2.x && loc1.y === loc2.y
}

const checkCollisions = (loc) => {
  if (loc.y < 0 || loc.y >= HEIGHT || loc.x < 0 || loc.x >= WIDTH) {
    alive = false
  }
  tail.forEach((tailCell, idx) => {
    if (idx !== 0) {
      if (compareLocations(tailCell, loc)) alive = false
    }
  })
}

const eatFood = () => {
  tailLength++
  score = tailLength - TAIL_START_LENGTH
  currentScoreEl.innerText = `Score: ${score}`
  if (score > highScore) {
    highScore = score
    highScoreEl.innerText = `High Score: ${highScore}`
  }
  audioChime.currentTime = 0
  audioChime.play()
  newFood()
}

const renderTailStart = () => {
  const tailStart = tail[tail.length - 1]
  const tailStartEl = document.querySelector(`#r${tailStart.y}c${tailStart.x}`)

  let rotation
  if (prevDirection) {
    if (prevDirection === currentDirection) {
      rotation = DIRECTIONS[currentDirection].rotation
      tailStartEl.innerHTML = `<img src='../assets/ship-tail-straight.png' class='rotate${rotation}'>`
    } else {
      rotation =
        DIRECTIONS[prevDirection].nextDirectionRotation[currentDirection]
      tailStartEl.innerHTML = `<img src='../assets/ship-tail-turn.png' class= 'rotate${rotation}'>`
    }
  }
}

const renderTailEnd = () => {
  const tailEnd = tail[0]
  const tailEndEl = document.querySelector(`#r${tailEnd.y}c${tailEnd.x}`)

  let rotation

  if (tail[1]) {
    if (tail[1].y === tail[0].y) {
      tail[1].x > tail[0].x ? (rotation = 90) : (rotation = 270)
    } else {
      tail[1].y > tail[0].y ? (rotation = 180) : (rotation = 0)
    }
  } else {
    rotation = DIRECTIONS[currentDirection].rotation
  }

  tailEndEl.innerHTML = `<img src='../assets/ship-tail-end.png' class='rotate${rotation}'>`
}

const moveSnake = () => {
  moveQueued = false
  tail.push(currentLocation)
  const newLocation = {
    x: currentLocation.x + DIRECTIONS[currentDirection].x,
    y: currentLocation.y + DIRECTIONS[currentDirection].y
  }

  checkCollisions(newLocation)

  if (alive) {
    renderTailStart()
    prevDirection = currentDirection

    currentLocation = newLocation

    if (compareLocations(currentLocation, foodLocation)) {
      eatFood()
    } else {
      if (tail.length > tailLength) {
        let prevTail = tail.shift()
        clearCell(prevTail)
      }
      renderTailEnd()
    }
    audioSoftClick.currentTime = 0
    audioSoftClick.play()
    render()
  }
}

const handleKeydown = (e) => {
  if (moveQueued) return

  if (e.keyCode === 82) init()

  if (alive) {
    const keyCodeStr = e.keyCode.toString()
    const validKeys = Object.keys(KEYCODES)
    if (!validKeys.includes(keyCodeStr)) return

    const newDirection = KEYCODES[keyCodeStr]
    if (
      newDirection === currentDirection ||
      newDirection === DIRECTIONS[currentDirection].opposite
    )
      return
    else {
      moveQueued = true
      currentDirection = newDirection
    }
  }
}

const gameOver = () => {
  audioGameOver.play()
  messageEl.innerText = `Game over! You scored ${tailLength}.\nPress R to restart.`
}

const playGame = () => {
  document.removeEventListener('keydown', playGame)
  messageText = 'Move with the arrow keys or WASD.'
  moveSnake()
  tickspeed = Math.max(100, TICKSPEED_START - 5 * tailLength)
  if (alive) setTimeout(playGame, tickspeed)
  else gameOver()
}

const init = () => {
  createBoard()
  messageText = 'Press any key to begin.'
  tickspeed = TICKSPEED_START
  tailLength = TAIL_START_LENGTH
  score = 0
  if (!highScore) highScore = 0
  if (tail) {
    tail.forEach((cell) => clearCell(cell))
  }
  tail = []
  currentLocation = {
    x: Math.floor(WIDTH / 2),
    y: Math.floor(HEIGHT / 2)
  }
  currentDirection = 'r'
  alive = true
  newFood()
  render()
  document.addEventListener('keydown', playGame)
}

/* +-+-+-+- EVENT LISTENERS -+-+-+-+ */

document.addEventListener('keydown', handleKeydown)

/* +-+-+-+- INITIALIZATION -+-+-+-+ */

init()
