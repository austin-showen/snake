# **_SnakeShip_**

## Date: 5/12/2023

### Author: Austin Showen

[Website](#) | [GitHub](github.com/austin-showen) | [LinkedIn](#)

---

### **_Description_**

**A browser-based, space-themed Snake game implemented in vanilla JavaScript. Created in May 2023 as part of the General Assembly Software Engineering Immersive.**

---

### **_Technologies_**

- JavaScript
  - DOM Manipulation
- HTML
- CSS
  - Flexbox
  - Grid

---

### **_Getting Started_**

#### Click [here](snakeship.surge.sh) to play the game.

#### Press ENTER to begin a game of SnakeShip. Pilot your ship with the arrow keys or WASD to collect energy. The more energy you collect, the faster you'll travel, and the longer your exhaust trail will be. As an extra challenge, asteroids will spawn as you score points.

#### Watch out! If you collide with your exhaust trail, hit an asteroid, or travel out of bounds, the game ends!

#### Specifications:

- The ship moves around the grid, scoring points and growing in length as it collects energy.
- The player can change the ship's direction by pressing an arrow key or WASD or by clicking the direction arrows below the grid.
- The player can mute, pause, or reset the game with keyboard controls or by clicking the icons below the grid.
- As the player scores points, the game speed increases and asteroids randomly spawn around the grid.
- If the ship collides with its trail, an asteroid, or the boundaries of the grid, the game ends.
- Audio cues play when the ship moves, collects energy, or hits an obstacle.

---

### **_Screenshots_**

#### The Game Over screen. The player collided with a wall after collecting 34 energy tokens.

![Screenshot of the Game Over screen](/screenshots/screenshot1.PNG)

&nbsp;
&nbsp;

#### The start screen. Note that the reset button is grayed out/inactive, and no asteroids have spawned yet.

![Screenshot of the start screen](/screenshots/screenshot2.PNG)

&nbsp;
&nbsp;

#### A paused game. Note that the active direction (down) is highlighted in blue. While paused, the player can mute and unmute the game, but they cannot input additional directions.

![Screenshot of a paused game](/screenshots/screenshot3.PNG)

---

### **_Stretch Goals_**

- [x] A simple musical tone will play when the snake moves, changes direction, or scores a point.
- [x] The difficulty will increase at certain score thresholds, increasing the speed of the game.
- [x] The game elements are represented by embedded images.
  - [x] The ship and its trail render in the correct orientation. The ship sprite rotates as the player inputs directions.
  - [x] When the ship turns, the correct trail sprite renders in the correct orientation.
- [ ] When the difficulty increases, a musical cue will play, and the sound effects will increase in pitch.
- [ ] The user can change the size of the grid.
- [ ] The user can select a difficulty level, which changes the snake's movement speed.
- [ ] The game displays correctly on mobile screens.
- [ ] High scores are tracked on a scoreboard.

---

### **_Credits_**

##### Background image: [Galaxy](https://unsplash.com/photos/rCbdp8VCYhQ) by Andy Holmes

##### Sound effects: [Kenney.nl](kenney.nl), accessed via [Open Game Art](https://opengameart.org/content/63-digital-sound-effects-lasers-phasers-space-etc)

##### Sprites:

##### - Spaceship: [Pixel Spaceship](https://opengameart.org/content/pixel-spaceship) by dsonyy

##### - Asteroid: [Brown Asteroid](https://opengameart.org/content/brown-asteroid) by Funwithpixels

##### - Energy: [Free Pixel Effects Pack](https://opengameart.org/content/free-pixel-effects-pack) by CodeManu

##### - Icons: [GUI Pack](https://opengameart.org/content/gui-pack) by trezegames

##### Sprite editor: [Piskel](https://www.piskelapp.com/p/create/sprite)

##### Wireframe creation: [Draw.io](draw.io)
