// ======================= Notes and explination =====================

    // My idea for this is to have a stop watch running in the background
    // let 15 min time limit - DONE YAAAAY
    // You will have to hit continue a random int amount from 5 - 10 items
    // You will get 2 bc for the tasks if you go over time limit
    // you will gain 4 bc for the tasks you complete on time
    // you have to hit continue to complete a task
    // if you go over the time limit and have not completed the goal 
    // you loose a heart
    // display the bc brain condensation everytime you complete something
    // display the bc brain condensation at the end of the limit

// =====================================================================

// ======================= Todo ========================================

// we check to see if the time has run out only after we hit continue
// it should stop the game when the time runs out not when we hit continue
// and the time has run out

// get rid of the game motif... make it a little reminder... should be a random increment
// like 17 mins - 24 mins of inactivity... be like hey if your brain wants to
// condensate of the computer that's all good touch some grass... finish your session
// so you can get credit... then store that in the db and you can do something
/// cool later on to visualize your condensation over time ahha


/// Reset inGamebc
// =====================================================================



// init packages
const fs = require("fs");
const inquirer = require('inquirer');
const player = require('play-sound')();
const format = require('date-fns');

// init variables
let itemsPosted = 0;
let hearts = 5
const timeLimit = 900000; // 15 mins in miliseconds
const min = 10;
const max = 50;
const brainActionGoal = Math.floor(Math.random() * (max - min + 1)) + min
let brainCondensation = 0;
let elapsedTimeString = '';
let elapsedTime = 0;
let inGameBc = 0;

// making the stopwatch to keep time
// i made it a class so that I can re-use it
class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) return;
        this.startTime = Date.now() - this.elapsedTime;
        this.isRunning = true;
    }

    stop() {
        if(!this.isRunning) return;
        this.elapsedTime = Date.now() - this.startTime;
        this.isRunning = false;
    }

    reset() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isRunning = false;
    }

    getRunningTimeString() {
        // Calculate the elapsed time in milliseconds
        const time = this.isRunning ? Date.now() - this.startTime : this.elapsedTime;
    
        // Calculate seconds, minutes, and hours
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor(time / (1000 * 60 * 60));
    
        // Build the output string with hours if they are non-zero
        if (hours > 0) {
            return `${String(hours).padStart(2, '0')} hrs ${String(minutes).padStart(2, '0')} mins ${String(seconds).padStart(2, '0')} secs`;
        } else {
            return `${String(minutes).padStart(2, '0')} mins ${String(seconds).padStart(2, '0')} secs`;
        }
    }
    

    

    getElapsedTimeString() {
        const time = this.isRunning ? Date.now() - this.startTime : this.elapsedTime;
        const totalSeconds = Math.floor(time / 1000);
        const seconds = totalSeconds % 60;

        const totalMinutes = Math.floor(totalSeconds / 60);
        const minutes = totalMinutes % 60;
        const hours = Math.floor(totalMinutes / 60);
        
        if (hours > 0) {
            return `${String(hours).padStart(2, '0')} hrs ${String(minutes).padStart(2, '0')} mins ${String(seconds).padStart(2, '0')} secs`;
        } else {
            return `${String(minutes).padStart(2, '0')} mins ${String(seconds).padStart(2, '0')} secs`;
        }
        
    }

    getElapsedTime() {
        const time = this.isRunning ? Date.now() - this.startTime : this.elapsedTime;
        return time;
    }
}

async function startGame() {
    
    // init the keepPlaying variable to use
    // in our while loop
    let keepPlaying = true;
    
    // reset the inGameBc level
    inGameBc = 0;
    

    while (keepPlaying) {
        // ask the user if they want to start the game
        const { start } = await inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'start',
                message: `\n\nwanna start...?`
            },
        ])

        if (!start) {
            // They don't want to play
            console.log(`\n\nokay maybe next time i love you jack`);
            keepPlaying = false;
            break;
        }
        
        // start a game with this function
        await singleGame();

         // in the case that we run out of hearts
        if (hearts === 0) {
            console.log("\n\nyou ran out of hearts.. \nmaybe take a brake... \👩🏾‍💻 you don't need to but just think about it...")
            keepPlaying = false;
            break;
        }
       
    }
}




async function singleGame () {
    // Start the display timer at the beginning of your game/session
    let isPlaying = true;

    // Starting up music :)
    player.play('./assets/pianoMotivate.mp3', function(err){
        if (err) console.log( err)
    });

    console.log("\nC'est parti!")
    console.log(`
        _.====.._
        ,:._       ~-_
            \`\\        ~-_
            | _  _  |  \`.
            ,/ /_)/ | |    ~-_
        -..__..-\`\`  \\_ \\_\\ \`_ ~~--..__...--- 
       `);

    const stopwatch = new Stopwatch();
    

  

    const gameLogic = async () => {
        const elapsedTime = stopwatch.getElapsedTime();
    
        return true;
    }


    while (isPlaying) {
        // start the stop watch 
        stopwatch.start();
        // ask question 
        const { action } = await inquirer
        .prompt([
            { // Questions here
                type:'list',
                name:'action',
                message: `please focus on completion and repetition 🎋 growing and learning 😊 `,
                choices: ['continue', 'x'],
            },
        ])

        if (action === 'continue') {
            // add 2 to the inGameBc
            inGameBc++;
            // play boosted sound
            await player.play('./assets/correct.mp3', function(err){
                if (err) console.log( err)
            })

             // Display the hearts here
            const outlinedHeart = "♡";
            const filledHeart = "♥";
                
            filledHeart + filledHeart + filledHeart + filledHeart + filledHeart

            let result = ""
                
            for (i = 0; i < 5; i++) {
                if (i < hearts) {
                    result += filledHeart + " ";
                } else {
                    result += outlinedHeart + " ";
                }  
            }
            
            // Show the heart levels and bc levels and the time that it took to complete this xp

            
            console.log(`\n\n[ ${brainCondensation + inGameBc}bc ] ${result.trim()}`);

 
                
            // Update progress alert
            if (inGameBc > 1) {
                console.log(`you've just grown your brain by ${inGameBc}bc! [ ${stopwatch.getElapsedTimeString()} ]\n\n`)
            }

            stopwatch.reset()

            
        } else if (action === 'x') {
            // we need to be quiting the game not the program here
            console.log(`\n\ni love you Jack and you love your 🧠 because it now has \n[ ${brainCondensation}bc ]`)
            isPlaying = false;
            // When the game is over, stop the display timer
            clearInterval(displayInterval);
        }

        if (isPlaying) {
            isPlaying = await gameLogic();
        }
    }
}

// startGame();
singleGame();