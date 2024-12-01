// This game was made using ChatGPT!
// All commands for creating this game were entered into ChatGPT by pawela827.
// All functions in the code have been described by ChatGPT!

// Create start screen container
const startScreen = document.createElement('div');
startScreen.style.position = 'absolute';
startScreen.style.width = '600px';
startScreen.style.height = '200px';
startScreen.style.border = '2px solid #333';
startScreen.style.backgroundColor = '#87CEEB'; // Sky blue background
startScreen.style.overflow = 'hidden';
startScreen.style.top = '50%';
startScreen.style.left = '50%';
startScreen.style.transform = 'translate(-50%, -50%)';
document.body.appendChild(startScreen);

// Save position of the start screen
localStorage.setItem('startScreenLeft', startScreen.style.left);
localStorage.setItem('startScreenTop', startScreen.style.top);

// Title text above the button
const titleText = document.createElement('div');
titleText.style.position = 'absolute';
titleText.style.top = '20px';
titleText.style.width = '100%';
titleText.style.textAlign = 'center';
titleText.style.fontSize = '30px';
titleText.style.color = 'black';
titleText.textContent = 'Dino';
startScreen.appendChild(titleText);

// Create the "Start Game" button
const startButton = document.createElement('button');
startButton.style.position = 'absolute';
startButton.style.bottom = '40px';
startButton.style.left = '50%';
startButton.style.transform = 'translateX(-50%)';
startButton.style.padding = '10px 20px';
startButton.style.fontSize = '20px';
startButton.textContent = 'Start Game';
startScreen.appendChild(startButton);

// Create footer text at the bottom inside start screen
const footerTextStartScreen = document.createElement('div');
footerTextStartScreen.style.position = 'absolute';
footerTextStartScreen.style.bottom = '10px';
footerTextStartScreen.style.left = '50%';
footerTextStartScreen.style.transform = 'translateX(-50%)';
footerTextStartScreen.style.fontSize = '10px';
footerTextStartScreen.style.color = 'gray';
footerTextStartScreen.textContent = 'Made by pawela827';
startScreen.appendChild(footerTextStartScreen);

// Create game container (initially hidden)
const gameContainer = document.createElement('div');
gameContainer.style.position = 'absolute';
gameContainer.style.width = '600px';
gameContainer.style.height = '200px';
gameContainer.style.border = '2px solid #333';
gameContainer.style.backgroundColor = '#87CEEB'; // Sky blue background
gameContainer.style.overflow = 'hidden';
gameContainer.style.top = '50%';
gameContainer.style.left = '50%';
gameContainer.style.transform = 'translate(-50%, -50%)';
gameContainer.style.display = 'none'; // Hide game container until game starts
document.body.appendChild(gameContainer);

// Set a fixed background color for the game (no moving background)
gameContainer.style.backgroundColor = '#87CEEB'; // Sky blue background

// Create the ground (stays static)
const ground = document.createElement('div');
gameContainer.appendChild(ground);
ground.style.position = 'absolute';
ground.style.bottom = '0';
ground.style.width = '100%';
ground.style.height = '20px';
ground.style.backgroundColor = '#a0522d'; // Ground texture (brown)

// Create ground texture (stripes)
for (let i = 0; i < 600 / 20; i++) {
    const stripe = document.createElement('div');
    ground.appendChild(stripe);
    stripe.style.width = '20px';
    stripe.style.height = '5px';
    stripe.style.backgroundColor = '#8b4513'; // Darker brown
    stripe.style.display = 'inline-block';
}

// Create the Cube (player character) with rounded corners
const cube = document.createElement('div');
gameContainer.appendChild(cube);
cube.style.position = 'absolute';
cube.style.width = '40px';  // Cube width
cube.style.height = '40px'; // Cube height
cube.style.backgroundColor = '#32CD32'; // Green color for the cube
cube.style.bottom = '20px'; // Positioned above the ground
cube.style.left = '50px';
cube.style.borderRadius = '8px'; // Rounded corners for the cube

// Create a Game Over message
const gameOverMessage = document.createElement('div');
gameOverMessage.style.position = 'absolute';
gameOverMessage.style.width = '100%';
gameOverMessage.style.textAlign = 'center';
gameOverMessage.style.fontSize = '30px';
gameOverMessage.style.color = 'red';
gameOverMessage.style.display = 'none'; // Hidden by default
gameOverMessage.textContent = "Game Over!";
gameContainer.appendChild(gameOverMessage);

// Points display in the top-right corner
const pointsDisplay = document.createElement('div');
pointsDisplay.style.position = 'absolute';
pointsDisplay.style.top = '10px'; // Position at the top
pointsDisplay.style.right = '10px'; // Position at the right
pointsDisplay.style.fontSize = '14px';
pointsDisplay.style.color = 'black';
pointsDisplay.textContent = 'HI ${highestPoints} 0';
gameContainer.appendChild(pointsDisplay);

// Gray text at the bottom of the game screen (adjusted)
const footerTextGameScreen = document.createElement('div');
footerTextGameScreen.style.position = 'absolute';
footerTextGameScreen.style.bottom = '0'; // Position it at the very bottom
footerTextGameScreen.style.left = '50%';
footerTextGameScreen.style.transform = 'translateX(-50%)';
footerTextGameScreen.style.fontSize = '10px';
footerTextGameScreen.style.color = 'gray';
footerTextGameScreen.textContent = 'Made by pawela827';
gameContainer.appendChild(footerTextGameScreen);

// Game variables
let isJumping = false;
let cubePosition = 20; // Start above the ground
let gameOver = false; // Game over flag
let cactusArray = []; // Array to store cacti
let speed = 5; // Speed of cactus movement
let points = 0; // Points counter
let highestPoints = localStorage.getItem('highestPoints') ? parseInt(localStorage.getItem('highestPoints')) : 0;
let lastCactusCrossed = -1; // Variable to track last cactus passed (to avoid double points)
const maxJumpHeight = 100; // Max jump height of the cube

// Make the window movable by dragging
let isDragging = false;
let offsetX, offsetY;

function startDrag(event) {
    isDragging = true;
    offsetX = event.clientX - startScreen.offsetLeft;
    offsetY = event.clientY - startScreen.offsetTop;
}

function dragMove(event) {
    if (isDragging) {
        startScreen.style.left = `${event.clientX - offsetX}px`;
        startScreen.style.top = `${event.clientY - offsetY}px`;
		// Save position of the start screen
		localStorage.setItem('startScreenLeft', startScreen.style.left);
		localStorage.setItem('startScreenTop', startScreen.style.top);
    }
}

function stopDrag() {
    isDragging = false;
}

// Add event listeners for dragging
startScreen.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', dragMove);
document.addEventListener('mouseup', stopDrag);

// Handle jump
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
	event.preventDefault(); // Prevent scrolling behavior of spacebar
        if (gameOver) {
            restartGame(); // Restart the game if game over
        } else if (!isJumping) {
            jump(); // Jump if not in game over state
        }
    }
});

// Create random cacti at random positions
function createCactus() {
    if (gameOver) return;

    // Ensure cactus height does not exceed the cube's max jump height
    const cactusHeight = Math.random() * (maxJumpHeight - 40) + 40; // Between 40px and maxJumpHeight (100px)

    // Adjust cactus height based on the current cube's position
    const adjustedCactusHeight = Math.min(cactusHeight, maxJumpHeight - cubePosition);

    // Make the width of the cactus larger for shorter cacti and smaller for taller ones
    const cactusWidth = (1 - (adjustedCactusHeight / maxJumpHeight)) * 30 + 10; // Width range between 10 and 40px

    const cactus = document.createElement('div');
    cactus.style.position = 'absolute';
    cactus.style.width = `${cactusWidth}px`; // Slimmer width
    cactus.style.height = `${adjustedCactusHeight}px`; // Adjusted height based on cube's jump space
    cactus.style.backgroundColor = '#228B22'; // Cactus color (green)
    cactus.style.bottom = '20px'; // Positioned on the ground level
    cactus.style.left = '600px'; // Start at the far right
    gameContainer.appendChild(cactus);
    cactusArray.push(cactus);
}

// Move cacti and check for collisions
function moveCacti() {
    if (gameOver) return;

    cactusArray.forEach((cactus, index) => {
        // Move cactus to the left
        cactus.style.left = `${parseInt(cactus.style.left) - speed}px`;

        // If cactus moves off-screen, remove it
        if (parseInt(cactus.style.left) < -cactus.offsetWidth) {
            cactus.remove();
            cactusArray.splice(index, 1); // Remove cactus from array
        }

        // Check for collision with the cube
        if (parseInt(cactus.style.left) < 50 + cube.offsetWidth && parseInt(cactus.style.left) + cactus.offsetWidth > 50 && cubePosition <= 20) {
            if (points > highestPoints) {
                highestPoints = points;
                localStorage.setItem('highestPoints', highestPoints);
            }
			stopPointIncrement();
			gameOver = true;
            gameOverMessage.style.display = 'block'; // Show game over message
        }
    });
}

// Check if cube passes over a cactus (without colliding)
function checkPassedCactus() {
    cactusArray.forEach((cactus, index) => {
        // If the cactus has moved past the cube and was not previously counted, add points
        if (parseInt(cactus.style.left) < 50 && !cactus.hasPassed) {
            pointsDisplay.textContent = `HI ${highestPoints} ${points}`;
            cactus.hasPassed = true; // Mark cactus as passed
        }
    });
}

// Game loop to create and move cacti
function gameLoop() {
    if (gameOver) return;
    moveCacti();
    checkPassedCactus(); // Check if the cube successfully jumps over any cactus
    requestAnimationFrame(gameLoop);
}

// Start creating cacti at random intervals
setInterval(createCactus, 2000); // Create new cactus every 2 seconds

// Start the game when the start button is clicked
function startGame() {
    startScreen.style.display = 'none'; // Hide start screen
    gameContainer.style.display = 'block'; // Show game screen
    
    // Load saved position if available and apply to both startScreen and gameContainer
    const savedLeft = localStorage.getItem('startScreenLeft');
    const savedTop = localStorage.getItem('startScreenTop');
	
	if (savedLeft && savedTop) {
        startScreen.style.left = savedLeft;
        startScreen.style.top = savedTop;
        gameContainer.style.left = savedLeft;  // Apply the same position to the game container
        gameContainer.style.top = savedTop;   // Apply the same position to the game container
    }
	
    // Reset points when the game starts
    points = 0; 
    pointsDisplay.textContent = "HI ${highestPoints} ${points}"; // Reset points display

    // Restart the game (reset any previous cacti or game-over state)
    restartGame(); // Call the restartGame function to reset all necessary variables
}

function jump() {
    isJumping = true;
    let upInterval = setInterval(() => {
        if (cubePosition >= maxJumpHeight) {
            clearInterval(upInterval);

            // Falling down
            let downInterval = setInterval(() => {
                if (cubePosition <= 20) {
                    clearInterval(downInterval);
                    isJumping = false;
                } else {
                    cubePosition -= 5;
                    cube.style.bottom = cubePosition + 'px';
                }
            }, 20);
        } else {
            cubePosition += 5;
            cube.style.bottom = cubePosition + 'px';
        }
    }, 20);
}

// Restart the game
function restartGame() {
    // Hide the game over message
    gameOverMessage.style.display = 'none';

    // Reset game variables
    gameOver = false;
    isJumping = false;
    cubePosition = 20;
    cube.style.bottom = cubePosition + 'px';
    speed = 5;
    points = 0; // Reset points
    pointsDisplay.textContent = `HI ${highestPoints} 0`; // Reset points display
    lastCactusCrossed = -1; // Reset last crossed cactus index
    cactusArray.forEach(cactus => cactus.remove()); // Remove all cacti
    cactusArray = []; // Reset cactus array

    // Start point increment
    startPointIncrement();

    // Start the game loop
    gameLoop(); // This starts the game loop once, and continues until the game ends
}

let pointsInterval;
function startPointIncrement() {
    pointsInterval = setInterval(() => {
        if (!gameOver) {
            points += 10; // Increase points by 10 every second
            pointsDisplay.textContent = `HI ${highestPoints} ${points}`;
        }
    }, 1000); // 1000 milliseconds = 1 second
}

function stopPointIncrement() {
    clearInterval(pointsInterval); // Stop the point increment when game is over
}

// Add click event for starting the game
startButton.addEventListener('click', startGame);
