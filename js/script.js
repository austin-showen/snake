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

/* +-+-+-+- STATE VARIABLES -+-+-+-+ */
let tailLength
let currentDirection
let currentLocation
let tail
let foodLocation
let highScore
let alive

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

const moveSnake = () => {
  tail.push(currentLocation)
  tail.unshift()
  currentLocation[0] += currentDirection[0]
  currentLocation[1] += currentDirection[1]
  render()
}

const init = () => {
  createBoard()
  tailLength = 0
  tail = []
  currentLocation = [Math.floor(WIDTH / 2), Math.floor(HEIGHT / 2)]
  currentDirection = [0, 1]
  alive = true
  newFood()
  render()
  moveSnake()
}

/* +-+-+-+- EVENT LISTENERS -+-+-+-+ */

/* +-+-+-+- INITIATION -+-+-+-+ */

init()
