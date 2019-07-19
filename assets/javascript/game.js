Hangman = {
    // win/loss record
    stats: {
        wins: 0,
        losses: 0,
    },

    // State of current game
    gameState: {
        word: "",
        guessesRemaining: 0,
        guessHistory: [],
        badGuesses: [],
        displayedWord: "",
        gameOver: false,
        reset: function () {
            this.word = this.wordList[Math.floor(Math.random() * this.wordList.length)];
            this.guessesRemaining = 10;
            this.guessHistory = [];
            this.badGuesses = [];
            this.displayedWord = "_".repeat(this.word.length);
            this.gameOver = false;
            document.querySelector('#word').innerText = this.displayedWord;
            document.querySelector('#status').innerText = '';
            document.querySelector('#message').innerText = 'Press any letter to make a guess';
            const hist = document.querySelector('#history')
            while (hist.firstChild) {
                hist.removeChild(hist.firstChild);
            }
        },
        // Words from https://www.hangmanwords.com/words
        // Should probably be in a JSON file or something.
        // Processed from the website with:
        // a = words.split('\n');
        // let b = '[';
        // a.forEach(word => b += `"${word}", `)
        // b += ']'
        // Then some manual formatting

        wordList: ["abruptly", "absurd", "abyss", "affix",
            "askew", "avenue", "awkward", "axiom", "azure",
            "bagpipes", "bandwagon", "banjo", "bayou", "beekeeper",
            "bikini", "blitz", "blizzard", "boggle", "bookworm",
            "boxcar", "boxful", "buckaroo", "buffalo", "buffoon",
            "buxom", "buzzard", "buzzing", "buzzwords", "caliph",
            "cobweb", "cockiness", "croquet", "crypt", "curacao",
            "cycle", "daiquiri", "dirndl", "disavow", "dizzying",
            "duplex", "dwarves", "embezzle", "equip", "espionage",
            "euouae", "exodus", "faking", "fishhook", "fixable",
            "fjord", "flapjack", "flopping", "fluffiness", "flyby",
            "foxglove", "frazzled", "frizzled", "fuchsia", "funny",
            "gabby", "galaxy", "galvanize", "gazebo", "giaour",
            "gizmo", "glowworm", "glyph", "gnarly", "gnostic",
            "gossip", "grogginess", "haiku", "haphazard", "hyphen",
            "iatrogenic", "icebox", "injury", "ivory", "ivy",
            "jackpot", "jaundice", "jawbreaker", "jaywalk",
            "jazziest", "jazzy", "jelly", "jigsaw", "jinx",
            "jiujitsu", "jockey", "jogging", "joking", "jovial",
            "joyful", "juicy", "jukebox", "jumbo", "kayak", "kazoo",
            "keyhole", "khaki", "kilobyte", "kiosk", "kitsch",
            "kiwifruit", "klutz", "knapsack", "larynx", "lengths",
            "lucky", "luxury", "lymph", "marquis", "matrix",
            "megahertz", "microwave", "mnemonic", "mystify",
            "naphtha", "nightclub", "nowadays", "numbskull",
            "nymph", "onyx", "ovary", "oxidize", "oxygen", "pajama",
            "peekaboo", "phlegm", "pixel", "pizazz", "pneumonia",
            "polka", "pshaw", "psyche", "puppy", "puzzling",
            "quartz", "queue", "quips", "quixotic", "quiz",
            "quizzes", "quorum", "razzmatazz", "rhubarb", "rhythm",
            "rickshaw", "schnapps", "scratch", "shiv", "snazzy",
            "sphinx", "spritz", "squawk", "staff", "strength",
            "strengths", "stretch", "stronghold", "stymied",
            "subway", "swivel", "syndrome", "thriftless",
            "thumbscrew", "topaz", "transcript", "transgress",
            "transplant", "triphthong", "twelfth", "twelfths",
            "unknown", "unworthy", "unzip", "uptown", "vaporize",
            "vixen", "vodka", "voodoo", "vortex", "voyeurism",
            "walkway", "waltz", "wave", "wavy", "waxy", "wellspring",
            "wheezy", "whiskey", "whizzing", "whomever", "wimpy",
            "witchcraft", "wizard", "woozy", "wristwatch", "wyvern",
            "xylophone", "yachtsman", "yippee", "yoked", "youthful",
            "yummy", "zephyr", "zigzag", "zigzagging", "zilch",
            "zipper", "zodiac", "zombie"]
    },

    reset: function () {
        this.gallows.reset();
        this.gameState.reset();
        // Will need to reset some DOM stuff too here
    },

    keyEvent: function (event) {
        const key = event.key.toLowerCase();   // we reference this a bunch, so storing it
        const code = key.charCodeAt();
        const state = this.gameState;

        if (this.gameState.gameOver) {
            if (key == " ") {
                this.reset();
            }
            return;
        }
        
        console.log(key.length);

        // Test if the key pushed is a letter, and if we have already pushed it
        if (key.length != 1 ||
            !(code > 96 && code < 123) || // lower alpha (a-z)
            state.guessHistory.includes(key)) { // duplicate key
            return;
        }

        state.guessHistory.push(key);

        // Update the string with letters we have guessed
        if (state.word.includes(key)) {
            let res = ""
            for (let i = 0; i < state.word.length; i++) {
                res += state.word[i] == key && state.word[i] || state.displayedWord[i];
            }
            // state.word.forEach((letter, index) => {
            //     res += letter == key && letter || state.displayedWord[index];
            // });
            state.displayedWord = res;
            document.querySelector('#word').innerText = state.displayedWord;
            if (state.displayedWord == state.word) {
                // Player wins
                this.stats.wins++;
                document.querySelector('#status').innerText = 'You Win!';
                document.querySelector('#message').innerText = 'Press "Space" to play again.';
                document.querySelector('#wins').innerText = this.stats.wins;

                this.gameState.gameOver = true;
            }

        } else {
            this.badGuess(key);
        }

    },


    badGuess: function (letter) {
        this.gameState.badGuesses.push(letter);
        this.gameState.guessesRemaining--;
        this.gallows.drawNext();

        let newGuess = document.createElement('div');
        newGuess.innerText = letter;
        document.querySelector('#history').appendChild(newGuess);
        
        if (this.gameState.guessesRemaining == 0) {
            // Player Loses
            this.stats.losses++;
            document.querySelector('#status').innerText = 'You Lose!';
            document.querySelector('#word').innerText = this.gameState.word;
            document.querySelector('#message').innerText = 'Press "Space" to play again.';
            document.querySelector('#losses').innerText = this.stats.losses;
            this.gameState.gameOver = true;
            return;
        }
        
    },

    gallows: {
        step: 0,
        drawNext: function () {
            this.sheet.insertRule(this.rules[this.step]);
            this.step++;

        },
        rules: [
            '.gallows .base {visibility: visible;}',
            '.gallows .frame {visibility: visible; border-right: 5px solid white;}',
            '.gallows .frame {border-top: 5px solid white;}',
            '.gallows .frame {border-left: 5px solid white;}',
            '.man .head {visibility: visible;}',
            '.man .body {visibility: visible;}',
            '.man .left-arm {visibility: visible;}',
            '.man .right-arm {visibility: visible;}',
            '.man .left-leg {visibility: visible;}',
            '.man .right-leg {visibility: visible;}',
        ],

        sheet: (function () {
            const style = document.createElement("style");

            // WebKit hack
            style.appendChild(document.createTextNode(""));

            document.head.appendChild(style);

            return style.sheet;
        })(),

        reset: function () {

            // Remove styling;
            // for (let i = 0; i < this.sheet.cssRules.length; i++) {
            //     this.sheet.removeRule(i);
            //     console.log(i)
            // }

            while (this.step > 0) {
                this.step --;
                this.sheet.removeRule(this.step);
            }

        }
    },




}

Hangman.reset()
document.onkeyup = Hangman.keyEvent.bind(Hangman);

