/**
 * Snakes in Space
 *
 * Author: Austin Showen
 * Date: 05/05/2023
 **/

/* +-+-+-+- CONSTANTS -+-+-+-+ */

const WIDTH = 21
const HEIGHT = 21
const TICKSPEED = 500
const COLORS = {
  snake: 'yellow',
  food: 'blue',
  cell: 'red'
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
  u: [-1, 0],
  r: [0, 1],
  d: [1, 0],
  l: [0, -1]
}

/* +-+-+-+- STATE VARIABLES -+-+-+-+ */
let tailLength
let currentDirection
let currentLocation
let tail
let foodLocation
let highScore
let alive
let moveQueued

/* +-+-+-+- HTML ELEMENTS -+-+-+-+ */
const boardEl = document.querySelector('#board')

/* +-+-+-+- FUNCTIONS -+-+-+-+ */

const createBoard = () => {
  for (let row = 0; row < WIDTH; row++) {
    for (let col = 0; col < HEIGHT; col++) {
      const newCell = document.createElement('div')
      newCell.id = `r${row}c${col}`
      boardEl.appendChild(newCell)
    }
  }
}

const newFood = () => {
  if (foodLocation) clearCell(foodLocation)
  const foodRow = Math.floor(Math.random() * HEIGHT)
  const foodCol = Math.floor(Math.random() * WIDTH)
  foodLocation = [foodRow, foodCol]
}

const renderFood = () => {
  const foodCellEl = document.querySelector(
    `#r${foodLocation[0]}c${foodLocation[1]}`
  )
  foodCellEl.style.backgroundColor = COLORS.food
}

const renderSnake = () => {
  const snakeEl = document.querySelector(
    `#r${currentLocation[0]}c${currentLocation[1]}`
  )
  snakeEl.style.backgroundColor = COLORS.snake
}

const render = () => {
  renderFood()
  renderSnake()
}

const clearCell = (loc) => {
  const cellEl = document.querySelector(`#r${loc[0]}c${loc[1]}`)
  cellEl.style.backgroundColor = COLORS.cell
}

const compareArrays = (arr1, arr2) => {
  return arr1.join(' ') === arr2.join(' ')
}

const checkCollisions = (loc) => {
  if (loc[0] < 0 || loc[0] >= HEIGHT || loc[1] < 0 || loc[1] >= WIDTH) {
    alive = false
  }
  tail.forEach((cell) => {
    if (compareArrays(cell, loc)) alive = false
  })
}

const moveSnake = () => {
  moveQueued = false
  tail.push([...currentLocation])
  const newLocation = [
    currentLocation[0] + currentDirection[0],
    currentLocation[1] + currentDirection[1]
  ]

  checkCollisions(newLocation)
  console.log(alive)

  if (alive) {
    currentLocation = newLocation

    if (compareArrays(currentLocation, foodLocation)) {
      tailLength++
      newFood()
    } else {
      let prevTail = tail.shift()
      clearCell(prevTail)
    }
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
    newDirection[0] + currentDirection[0] === 0 &&
    newDirection[1] + currentDirection[1] === 0
  )
    return
  else {
    moveQueued = true
    currentDirection = newDirection
  }
}

const playGame = () => {
  moveSnake()
  if (alive) setTimeout(playGame, TICKSPEED)
}

const init = () => {
  createBoard()
  tailLength = 0
  tail = []
  currentLocation = [Math.floor(WIDTH / 2), Math.floor(HEIGHT / 2)]
  currentDirection = DIRECTIONS.r
  alive = true
  newFood()
  render()
  playGame()
}

/* +-+-+-+- EVENT LISTENERS -+-+-+-+ */

document.addEventListener('keydown', handleKeydown)

/* +-+-+-+- INITIATION -+-+-+-+ */

init()
