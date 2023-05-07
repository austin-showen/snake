/**
 * Snakes in Space
 *
 * Author: Austin Showen
 * Date: 05/05/2023
 **/

/* +-+-+-+- CONSTANTS -+-+-+-+ */

const WIDTH = 21
const HEIGHT = 21
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
  u: { x: 0, y: -1 },
  r: { x: 1, y: 0 },
  d: { x: 0, y: 1 },
  l: { x: -1, y: 0 }
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
let currentLocation
let tail
let foodLocation
let highScore
let alive
let moveQueued
let tickspeed

/* +-+-+-+- HTML ELEMENTS -+-+-+-+ */
const boardEl = document.querySelector('#board')

/* +-+-+-+- FUNCTIONS -+-+-+-+ */

const createBoard = () => {
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
  snakeEl.style.backgroundColor = COLORS.snake
}

const render = () => {
  renderFood()
  renderSnake()
}

const clearCell = (loc) => {
  const cellEl = document.querySelector(`#r${loc.y}c${loc.x}`)
  cellEl.style.backgroundColor = COLORS.cell
}

const compareLocations = (loc1, loc2) => {
  return loc1.x === loc2.x && loc1.y === loc2.y
}

const checkCollisions = (loc) => {
  if (loc.y < 0 || loc.y >= HEIGHT || loc.x < 0 || loc.x >= WIDTH) {
    alive = false
  }
  tail.forEach((tailCell) => {
    if (compareLocations(tailCell, loc)) alive = false
  })
}

const moveSnake = () => {
  moveQueued = false
  tail.push(currentLocation)
  const newLocation = {
    x: currentLocation.x + currentDirection.x,
    y: currentLocation.y + currentDirection.y
  }

  checkCollisions(newLocation)

  if (alive) {
    currentLocation = newLocation

    if (compareLocations(currentLocation, foodLocation)) {
      tailLength++
      audioChime.play()
      newFood()
    } else {
      let prevTail = tail.shift()
      console.log(prevTail)
      clearCell(prevTail)
    }
    audioSoftClick.currentTime = 0
    audioSoftClick.play()
    render()
  }
}

const handleKeydown = (e) => {
  if (moveQueued) return

  const keyCodeStr = e.keyCode.toString()
  const validKeys = Object.keys(KEYCODES)
  if (!validKeys.includes(keyCodeStr)) return

  const newDirection = DIRECTIONS[KEYCODES[keyCodeStr]]
  if (
    newDirection.x + currentDirection.x === 0 &&
    newDirection.y + currentDirection.y === 0
  )
    return
  else {
    moveQueued = true
    currentDirection = newDirection
  }
}

const gameOver = () => {
  audioGameOver.play()
  console.log('dead')
}

const playGame = () => {
  moveSnake()
  tickspeed =
    tailLength < 5 ? 300 : tailLength < 10 ? 250 : tailLength < 15 ? 200 : 150
  if (alive) setTimeout(playGame, tickspeed)
  else gameOver()
}

const init = () => {
  createBoard()
  tickspeed = 300
  tailLength = 0
  tail = []
  currentLocation = {
    x: Math.floor(WIDTH / 2),
    y: Math.floor(HEIGHT / 2)
  }
  currentDirection = DIRECTIONS.r
  alive = true
  newFood()
  render()
  document.addEventListener('click', playGame)
}

/* +-+-+-+- EVENT LISTENERS -+-+-+-+ */

document.addEventListener('keydown', handleKeydown)

/* +-+-+-+- INITIALIZATION -+-+-+-+ */

init()
