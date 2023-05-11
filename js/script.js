/**
 * SnakeShip
 *
 * Author: Austin Showen
 * Date: 05/05/2023
 *
 * Background image: "Galaxy" by Andy Holmes, https://unsplash.com/photos/rCbdp8VCYhQ
 * Sound effects by Kenney.nl, https://opengameart.org/content/63-digital-sound-effects-lasers-phasers-space-etc
 * Spaceship sprite adapted from "Pixel Spaceship" by dsonyy, https://opengameart.org/content/pixel-spaceship
 * Asteroid sprite: "I Are Spaceship" by bart, https://opengameart.org/content/i-are-spaceship-16x16-space-sprites
 * Energy sprite: "Free Pixel Effects Pack" by CodeManu, https://opengameart.org/content/free-pixel-effects-pack
 * Icons: "GUI Pack" by trezegames, https://opengameart.org/content/gui-pack
 **/

/* +-+-+-+- CONSTANTS -+-+-+-+ */

const WIDTH = 13
const HEIGHT = 13
const TAIL_START_LENGTH = 2
const TICKSPEED_START = 300

const KEYCODES = {
  38: 'u',
  87: 'u',
  39: 'r',
  68: 'r',
  40: 'd',
  83: 'd',
  37: 'l',
  65: 'l',
  82: 'reset',
  77: 'mute',
  80: 'pause'
}

const DIRECTIONS = {
  u: {
    x: 0,
    y: -1,
    opposite: 'd',
    shipRotation: 0,
    tailBendRotation: {
      l: 270,
      r: 180
    }
  },
  r: {
    x: 1,
    y: 0,
    opposite: 'l',
    shipRotation: 90,
    tailBendRotation: {
      u: 0,
      d: 270
    }
  },
  d: {
    x: 0,
    y: 1,
    opposite: 'u',
    shipRotation: 180,
    tailBendRotation: {
      l: 0,
      r: 90
    }
  },
  l: {
    x: -1,
    y: 0,
    opposite: 'r',
    shipRotation: 270,
    tailBendRotation: {
      u: 90,
      d: 180
    }
  }
}

/* +-+-+-+- AUDIO -+-+-+-+ */
const audioMove = new Audio('assets/tone1.mp3')
audioMove.volume = 0.2
const audioScore = new Audio('assets/phaserUp4.mp3')
const audioGameOver = new Audio('assets/phaserDown3.mp3')

/* +-+-+-+- STATE VARIABLES -+-+-+-+ */
let tailLength
let currentDirection
let prevDirection
let currentLocation
let tail
let energyLocation
let score
let highScore
let alive
let moveQueued
let tickspeed
let mute
let pause
let asteroids

/* +-+-+-+- HTML ELEMENTS -+-+-+-+ */
const boardEl = document.querySelector('#board')
const currentScoreEl = document.querySelector('#current-score')
const highScoreEl = document.querySelector('#high-score')
const messageEl = document.querySelector('#message')
const controlEl = document.querySelector('#controls')
const resetEl = document.querySelector('#reset')

/* +-+-+-+- FUNCTIONS -+-+-+-+ */

const getElement = (loc) => {
  return document.querySelector(`#r${loc.y}c${loc.x}`)
}

/* --- Render Functions --- */
const createBoard = () => {
  boardEl.innerHTML = ''
  for (let row = 0; row < WIDTH; row++) {
    for (let col = 0; col < HEIGHT; col++) {
      const newCell = document.createElement('div')
      newCell.id = `r${row}c${col}`
      newCell.style.backgroundColor = 'var(--cell-color)'
      boardEl.appendChild(newCell)
    }
  }
}

const renderEnergy = () => {
  const energyCellEl = getElement(energyLocation)
  energyCellEl.style.backgroundImage = 'url(../assets/energy.gif)'
}

const renderShip = () => {
  const shipEl = getElement(currentLocation)
  shipEl.innerHTML = `<img src='../assets/ship.png' class='rotate${DIRECTIONS[currentDirection].shipRotation}'>`
}

const renderScores = () => {
  currentScoreEl.innerText = `Score: ${score}`
  if (score > highScore) {
    highScore = score
    highScoreEl.innerText = `High Score: ${highScore}`
  }
}

const renderAsteroids = () => {
  asteroids.forEach((asteroidLocation) => {
    const asteroidEl = getElement(asteroidLocation)
    asteroidEl.style.backgroundImage = 'url(../assets/asteroid.png)'
  })
}

const render = () => {
  renderEnergy()
  renderShip()
  renderScores()
  renderAsteroids()
}

const renderTailStart = () => {
  const tailStart = tail[tail.length - 1]
  const tailStartEl = getElement(tailStart)

  let rotation
  if (prevDirection) {
    if (prevDirection === currentDirection) {
      rotation = DIRECTIONS[currentDirection].shipRotation
      tailStartEl.innerHTML = `<img src='/assets/ship-tail-straight.png' class='rotate${rotation}'>`
    } else {
      rotation = DIRECTIONS[prevDirection].tailBendRotation[currentDirection]
      tailStartEl.innerHTML = `<img src='/assets/ship-tail-turn.png' class='rotate${rotation}'>`
    }
  }
}

const renderTailEnd = () => {
  const tailEnd = tail[0]
  const tailEndEl = getElement(tailEnd)

  let rotation
  if (tail[1]) {
    if (tail[1].y === tail[0].y) {
      tail[1].x > tail[0].x ? (rotation = 90) : (rotation = 270)
    } else {
      tail[1].y > tail[0].y ? (rotation = 180) : (rotation = 0)
    }
  } else {
    rotation = DIRECTIONS[currentDirection].shipRotation
  }

  tailEndEl.innerHTML = `<img src='/assets/ship-tail-end.png' class='rotate${rotation}'>`
}

const clearCell = (loc) => {
  const cellEl = getElement(loc)
  cellEl.style.removeProperty('background-image')
  cellEl.innerHTML = ''
}

/* --- Game Logic Functions --- */

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
  asteroids.forEach((asteroidCell) => {
    if (compareLocations(asteroidCell, loc)) alive = false
  })
}

const getRandomLocation = () => {
  const randRow = Math.floor(Math.random() * HEIGHT)
  const randCol = Math.floor(Math.random() * WIDTH)
  return {
    x: randCol,
    y: randRow
  }
}

const newAsteroid = () => {
  let asteroidLocation = getRandomLocation()
  let asteroidEl = getElement(asteroidLocation)
  while (asteroidEl.style.backgroundImage) {
    asteroidLocation = getRandomLocation()
    asteroidEl = getElement(asteroidLocation)
  }
  asteroids.push(asteroidLocation)
}

const newEnergy = () => {
  if (energyLocation) clearCell(energyLocation)
  energyLocation = getRandomLocation()
  let energyEl = getElement(energyLocation)
  while (energyEl.style.backgroundImage) {
    energyLocation = getRandomLocation()
    energyEl = getElement(energyLocation)
  }
  if (score && score % 5 === 0) newAsteroid()
}

const pickUpEnergy = () => {
  tailLength++
  score = tailLength - TAIL_START_LENGTH
  renderScores()
  if (!mute) {
    audioScore.currentTime = 0
    audioScore.play()
  }
  newEnergy()
}

const moveShip = () => {
  if (pause) return

  highlightArrow(currentDirection)

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

    if (compareLocations(currentLocation, energyLocation)) {
      pickUpEnergy()
    } else {
      if (tail.length > tailLength) {
        let prevTail = tail.shift()
        clearCell(prevTail)
      }
      renderTailEnd()
    }
    if (!mute) {
      audioMove.currentTime = 0
      audioMove.play()
    }
    render()
  }
}

const togglePause = () => {
  pause = !pause
  const pauseMessageEl = document.querySelector('#pause-message')
  const pauseIconEl = document.querySelector('#pause-icon')
  const pauseEl = document.querySelector('#pause')
  if (pause) {
    pauseMessageEl.innerText = 'P to resume'
    pauseEl.style.opacity = '100%'
    pauseIconEl.style.opacity = '80%'
  } else {
    pauseMessageEl.innerText = 'P to pause'
    pauseEl.style.opacity = '50%'
    pauseIconEl.style.opacity = '0'
    gameLoop()
  }
}

const toggleMute = () => {
  mute = !mute
  const muteMessageEl = document.querySelector('#mute-message')
  const muteEl = document.querySelector('#mute')
  if (mute) {
    muteMessageEl.innerText = 'M to unmute'
    muteEl.src = 'assets/soundOff.png'
    muteEl.style.opacity = '50%'
  } else {
    muteMessageEl.innerText = 'M to mute'
    muteEl.src = 'assets/soundOn.png'
    muteEl.style.opacity = '100%'
  }
}

const highlightArrow = (direction) => {
  const arrowIds = ['u', 'r', 'l', 'd']
  arrowIds.forEach((id) => {
    const arrowEl = document.querySelector(`#${id}`)
    if (id === direction) {
      arrowEl.src = 'assets/arrow-blue.png'
      arrowEl.classList.add('highlight')
    } else {
      arrowEl.src = 'assets/arrow.png'
      arrowEl.classList.remove('highlight')
    }
  })
}

/* --- Event Handlers --- */

handleInput = (input) => {
  if (pause && input.length === 1) return
  if (alive && input === 'reset') return
  if (!alive && input !== 'reset') return

  if (input === 'pause') togglePause()
  else if (input === 'reset') init()
  else if (input === 'mute') toggleMute()
  else if (alive) {
    const newDirection = input
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

const handleClick = (e) => {
  if (moveQueued) return
  if (e.target.tagName !== 'IMG') return
  handleInput(e.target.id)
}

const handleKeydown = (e) => {
  if (moveQueued) return
  const keyCodeStr = e.keyCode.toString()
  if (!KEYCODES[keyCodeStr]) return
  handleInput(KEYCODES[keyCodeStr])
}

/* --- Game Controller Funtions --- */

const gameOver = () => {
  if (!mute) audioGameOver.play()

  const activeArrowEl = document.querySelector(`#${currentDirection}`)
  activeArrowEl.src = 'assets/arrow.png'
  activeArrowEl.classList.remove('highlight')

  resetEl.style.opacity = '100%'

  messageEl.innerText = `Game over! You scored ${score}.\nPress R to restart.`
}

const gameLoop = () => {
  moveShip()
  tickspeed = Math.max(100, TICKSPEED_START - 5 * tailLength)
  if (!pause) {
    if (alive) setTimeout(gameLoop, tickspeed)
    else gameOver()
  }
}

const playGame = () => {
  document.removeEventListener('keydown', playGame)
  controlEl.removeEventListener('click', playGame)
  messageEl.innerText = ''
  gameLoop()
}

/* --- Initialization Functions --- */

const initValues = () => {
  tickspeed = TICKSPEED_START
  tailLength = TAIL_START_LENGTH
  score = 0
  if (!highScore) highScore = 0
  if (!mute) mute = false
  pause = false
  alive = true
  currentDirection = 'r'
}

const initTail = () => {
  if (tail) {
    tail.forEach((cell) => clearCell(cell))
  }
  tail = []
}

const initAsteroids = () => {
  if (asteroids) {
    asteroids.forEach((cell) => clearCell(cell))
  }
  asteroids = []
}

const initStyles = () => {
  messageEl.innerText = `Collect the energy! Avoid your trail!\nPress any key to begin.`
  resetEl.style.opacity = '50%'
}

const init = () => {
  createBoard()
  initValues()
  initTail()
  initAsteroids()
  initStyles()
  newEnergy()
  currentLocation = {
    x: Math.floor(WIDTH / 2),
    y: Math.floor(HEIGHT / 2)
  }

  render()
  document.addEventListener('keydown', playGame)
  controlEl.addEventListener('click', playGame)
}

/* +-+-+-+- EVENT LISTENERS -+-+-+-+ */

document.addEventListener('keydown', handleKeydown)
controlEl.addEventListener('click', handleClick)

/* +-+-+-+- INITIALIZATION -+-+-+-+ */

init()
