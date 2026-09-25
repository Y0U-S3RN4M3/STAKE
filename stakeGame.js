const savedStats = localStorage.getItem("statsSave");

let stats = savedStats
    ? JSON.parse(savedStats)
    : {
        points: 0,
        speedLVL: 1,
        headStrengthLVL: 1,
        tailStrengthLVL: 1,
        waveSkippingLVL: 1
    };

function saveStats(){
    localStorage.setItem("statsSave", JSON.stringify(stats));
}

function loadStats(){
    const savedStats = localStorage.getItem("statsSave");

    if(savedStats){
        stats = JSON.parse(savedStats);
    }
}

const colNum = 20;
const rowNum = 15;
const boxSize = 25;

function runWave(waveNum){
    return new Promise(resolve => {
        const counntdown = document.createElement("div");
        counntdown.id = "countdown";
        counntdown.innerHTML = `<p>3</p>`;
        document.body.appendChild(counntdown);

        let countdown = 3;

        const countdownInterval = setInterval(() => {

            countdown--;

            if (countdown > 0) {
                document.getElementById("countdown").innerHTML = `
                    <p>${countdown}</p>
                `;
            } else {
                document.getElementById("countdown").innerHTML = `
                    <p>GO!</p>
                `;

                gameStarted = true;

                clearInterval(countdownInterval);

                setTimeout(() => {
                    document.getElementById("countdown").remove();
                }, 500);
            }

        }, 1000);

        let gameStarted = false;

        const grid = document.getElementById("grid");
        grid.innerHTML = '';

        for(let i = 0; i < rowNum * colNum; i++){
            grid.innerHTML += `
                <p id="box${i}" class="box"></p>
            `;
        }

        const enemyStrength = waveNum;
        const snakeHeadStrength = stats.headStrengthLVL;
        const snakeTailStrength = stats.tailStrengthLVL;
        const enemyIntSpeed = 350 - (waveNum * 10);
        const snakeIntSpeed = 255 - ((stats.speedLVL - 1) * 10);

        const speedMultiplier =
            1 + ((stats.waveSkippingLVL - 1) / 4);
        let snakeHealth = 20;
        let enemyMoveAxis = 0;

        document.getElementById("grid").style.gridTemplateRows =
            `repeat(${rowNum}, ${boxSize}px)`;

        document.getElementById("grid").style.marginTop = 
    `${((window.innerHeight - (rowNum * (boxSize + 5))) / 2) - 30}px`;

        document.getElementById("grid").style.gridAutoColumns = `${boxSize}px`
        
        document.querySelectorAll(".box").forEach(e => {
            e.style.height = `${boxSize}`;
            e.style.width = `${boxSize}`
        });

        document.getElementById("speed").textContent = `SPEED: ${(1000/snakeIntSpeed).toFixed(2)}CBS/S`;
        document.getElementById("enemySpeed").textContent = `ENEMY SPEED: ${(1000/enemyIntSpeed).toFixed(2)}CBS/S`;


        let snakeLength = 3;
        let snakeDirection = 'right';
        let nextDirection = 'right';

        let snakeX = 9;
        let snakeY = 7;

        let enemyX = Math.floor(Math.random() * colNum);
        let enemyY = Math.floor(Math.random() * rowNum);

        let snake = [
            getBoxNum(snakeX, snakeY),
            getBoxNum(snakeX - 1, snakeY)
        ];

        let fruitX = Math.floor(Math.random() * colNum);
        let fruitY = Math.floor(Math.random() * rowNum);


        function getBoxNum(x, y){
            return x * rowNum + y;
        }

        function getBoxElement(id){
            return document.getElementById(`${id}`);
        }

        function removeFromSnake(){
            snakeLength--;
            snake.pop();
            document.getElementById('health').textContent = `HEALTH: ${snakeHealth}`;
            document.getElementById("length").textContent = `LENGTH: ${snakeLength}`;
        }
        
        function clearGrid(){
            const boxList = document.querySelectorAll('.box');
            boxList.forEach(element => {
                element.textContent = '';
                element.style.backgroundColor = 'rgb(46, 46, 46)'
            })
        }

        function gameOver(){
            clearInterval(snakeInterval);
            clearInterval(enemyInterval);
            snakeHealth = 0;
            document.getElementById("health").textContent = 'HEALTH: 0'

            document.body.removeEventListener('keydown', keyListener);

            const screen = document.createElement('div');
            screen.classList.add('screen');
            if(snakeLength !== 0){
                screen.innerHTML = `
                <p>GAME OVER!</p>
                <p>SCORE: ${snakeLength}</p>
                `;
            } else{
                screen.innerHTML = `
                <p>GAME OVER!</p>
                `;
            }
            
            document.body.appendChild(screen);

            setTimeout(() => {
                document.body.removeChild(screen);
                clearGrid();
                resolve({won: false, score: snakeLength});
            }, 3000);

        }
        function waveWon(){
            clearInterval(snakeInterval);
            clearInterval(enemyInterval);

            document.body.removeEventListener('keydown', keyListener);

            const screen = document.createElement('div');
            screen.classList.add('screenWin');

            screen.innerHTML = `
                <p>WAVE WON!</p>
            `;

            document.body.appendChild(screen);

            setTimeout(() => {
                document.body.removeChild(screen);
                clearGrid();
                resolve({won: true, score: ((waveNum ** 5)/10)*snakeLength});
            }, 3000);
        }


        function generateFruit() {

            let tryingToFindSpot = true;

            while (tryingToFindSpot) {

                let possfruitX = Math.floor(Math.random() * colNum);
                let possfruitY = Math.floor(Math.random() * rowNum);

                let possibleFruitPosition =
                    getBoxNum(possfruitX, possfruitY);

                // Don't spawn fruit on the snake or enemy
                if (
                    !snake.includes(possibleFruitPosition) &&
                    !(possfruitX === enemyX && possfruitY === enemyY)
                ) {

                    fruitX = possfruitX;
                    fruitY = possfruitY;

                    tryingToFindSpot = false;
                }
            }

            getBoxElement(
                `box${getBoxNum(fruitX, fruitY)}`
            ).style.backgroundColor = 'orange';
        }


        getBoxElement(
            `box${getBoxNum(fruitX, fruitY)}`
        ).style.backgroundColor = 'orange';


        const keyListener = e => {

            if (e.key === "ArrowUp" || e.key === 'w') {
                if (snakeDirection !== 'down') {
                    nextDirection = 'up';
                }
            }

            if (e.key === "ArrowDown" || e.key === 's') {
                if (snakeDirection !== 'up') {
                    nextDirection = 'down';
                }
            }

            if (e.key === "ArrowLeft" || e.key === 'a') {
                if (snakeDirection !== 'right') {
                    nextDirection = 'left';
                }
            }

            if (e.key === "ArrowRight" || e.key === 'd') {
                if (snakeDirection !== 'left') {
                    nextDirection = 'right';
                }
            }
        };

        document.body.addEventListener('keydown', keyListener);


        // ========================
        // ENEMY INTERVAL
        // ========================

        const enemyInterval = setInterval(() => {
            if(!gameStarted) return;
            // Remove old enemy position
            getBoxElement(
                `box${getBoxNum(enemyX, enemyY)}`
            ).style.backgroundColor = 'rgb(46, 46, 46)';
            getBoxElement(
                `box${getBoxNum(enemyX, enemyY)}`
            ).textContent = '';




            // Move toward the snake instead of the fruit
            const targetIndex = Math.floor(snake.length / 2);
            const targetBox = snake[targetIndex];

            // Convert the box number back into X/Y coordinates
            const targetX = Math.floor(targetBox / rowNum);
            const targetY = targetBox % rowNum;

            if (enemyX !== targetX && enemyY !== targetY) {

        if (enemyMoveAxis === 0) {
            // Move horizontally
            if (enemyX < targetX) enemyX++;
            else if (enemyX > targetX) enemyX--;
        } else {
            // Move vertically
            if (enemyY < targetY) enemyY++;
            else if (enemyY > targetY) enemyY--;
        }

        enemyMoveAxis = 1 - enemyMoveAxis;

        } else if (enemyX !== targetX) {

            if (enemyX < targetX) enemyX++;
            else if (enemyX > targetX) enemyX--;

        } else if (enemyY !== targetY) {

            if (enemyY < targetY) enemyY++;
            else if (enemyY > targetY) enemyY--;
        }

            snake.forEach((e, ind) => {
                const enemyBoxNum = getBoxNum(enemyX, enemyY);
                if(enemyBoxNum === e){
                    if(e === getBoxNum(snakeX, snakeY)){
                        if(snakeHeadStrength <= enemyStrength){
                            gameOver();
                        }
                    }
                    else{
                        if(snakeTailStrength <= enemyStrength){
                            for(let i = ind; i < snake.length; i++){
                                removeFromSnake();
                            }
                            snakeHealth -= enemyStrength;
                            if(snakeHealth <= 0){
                                gameOver();
                            }
                        }
                    }
                
                }
            });
            

            // Draw enemy
            getBoxElement(
                `box${getBoxNum(enemyX, enemyY)}`
            ).style.backgroundColor = 'red';
            document.getElementById(
                `enemyStrength`
            ).textContent = `ENEMY STRENGTH: ${enemyStrength}`;

        }, enemyIntSpeed * speedMultiplier);


        // ========================
        // SNAKE INTERVAL
        // ========================

        const snakeInterval = setInterval(() => {
            if(!gameStarted) return;

            snakeDirection = nextDirection;


            // 1. Move the snake

            if (snakeDirection === 'up') {

                snakeY--;

            } else if (snakeDirection === 'down') {

                snakeY++;

            } else if (snakeDirection === 'left') {

                snakeX--;

            } else if (snakeDirection === 'right') {

                snakeX++;

            }


            // 2. Wrap around the edges

            if (snakeY < 0) {
                gameOver();
            }

            if (snakeY > rowNum - 1) {
                gameOver();
            }

            if (snakeX < 0) {
                gameOver();
            }

            if (snakeX > colNum - 1) {
                gameOver();
            }


            // 3. Calculate the new head position

            const snakeHead = getBoxNum(snakeX, snakeY);


            // 4. Add the new head

            snake.unshift(snakeHead);


            // 5. Check if the snake ate the fruit

            if (fruitX === snakeX && fruitY === snakeY) {
                if (snakeLength >= 10) {
                    waveWon();
                    return;
                } else{
                    snakeLength++;
                    document.getElementById("length").textContent = `LENGTH: ${snakeLength}`;
                    generateFruit();
                }
                
            } else if(fruitX === enemyX && fruitY === enemyY) {
                removeFromSnake();
                generateFruit();
            }


            // 6. Remove the tail if the snake is too long

            if (snake.length > snakeLength) {

                const removed = snake.pop();

                getBoxElement(`box${removed}`)
                    .style.backgroundColor = 'rgb(46, 46, 46)';
            }


            // 7. Check for self-collision

            const hasDuplicate =
                new Set(snake).size !== snake.length;

            if (hasDuplicate) {

                gameOver();

                return;
            }


            // 8. Draw the snake

            snake.forEach((e, i) => {

                getBoxElement(`box${e}`)
                    .style.backgroundColor =
                    i === 0
                        ? 'rgb(0, 45, 0)'
                        : 'green';

            });

            document.getElementById(
                'headStrength'
            ).textContent = `HEAD STRENGTH: ${snakeHeadStrength}`;

            document.getElementById(
                'tailStrength'
            ).textContent = `TAIL STRENGTH: ${snakeTailStrength}`;


            // Check if snake has died

            if(snakeLength <= 0){
                gameOver();
            }

        }, snakeIntSpeed * speedMultiplier);
    })
}

async function runGame(){

    const startingPoints = stats.points;

    let points = 0;
    let stillIn = true;
    let wave = ((stats.waveSkippingLVL - 1) * 5)+1;

    while(stillIn){

        const result = await runWave(wave);

        if(result.won){

            if(wave === 1){
                points += 10;
            }
            else{
                points += 5 ** wave;
            }

            wave++;

        } else {

            points += result.score;

            stillIn = false;
        }
    }

    // Add the points earned during this game
    // to the points the player had before starting.
    stats.points = startingPoints + points;

    saveStats();
}
async function run(){
    loadStats();
    await runGame();
    window.location.href = 'index.html';
}

run();