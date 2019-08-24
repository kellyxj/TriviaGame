//Makes question objects. We will use this to populate our game with an array of questions.
function makeQuestion (q, correct, wrong1, wrong2, wrong3) {
    const question = {
        questionText: q,
        correctAnswer: correct,
        wrongAnswer1: wrong1,
        wrongAnswer2: wrong2,
        wrongAnswer3: wrong3,
        //Randomizes order in which answer choices are displayed
        displayAnswerChoices: function() {
            return shuffle([this.correctAnswer,this.wrongAnswer1,this.wrongAnswer2,this.wrongAnswer3]);
        }
    }
    return question;
}

//Takes an array as input and returns an array with the same values in a random order. Does not mutate the input array.
function shuffle (array) {
    //Copying array into tempArray in order to not mutate array.
    const tempArray = [];
    for(i = 0; i < array.length; i++) {
        tempArray.push(array[i]);
    }
    const shuffledArray = [];
    while(tempArray.length > 0) {
        const randIndex = Math.floor(Math.random()*tempArray.length);
        const temp = tempArray[randIndex];
        tempArray[randIndex] = tempArray[tempArray.length-1];
        tempArray[tempArray.length-1] = temp;
        shuffledArray.push(tempArray.pop());
    }
    return shuffledArray;
}

//Stores all questions. Questions are stored as arrays. The first value is the question text. The second value is the
//correct answer. The next three values are incorrect answers.
qaArray = [
    [
        "Until 1972, this tropical island was called Ceylon. Now a commonwealth republic, it is currently known as:_____",
        "Sri Lanka",
        "Madagascar",
        "Barbados",
        "New Guinea"
    ],
    [
        "After Lake Baikal in Russia, this Central African lake is the second deepest and second largest (by volume) lake in the world.",
        "Tanganyika",
        "Victoria",
        "Malawi",
        "Kivu"
    ],
    [
        "For his discovery of radioactivity, this French physicist shared the 1903 Nobel Prize with Marie and Pierre Curie.",
        "Henri Becquerel",
        "Louis de Broglie",
        "Augustin-Jean Fresnel",
        "Paul Langevin"
    ],
    [
        "Which of the following orders of insect includes beetles?",
        "Coleoptera",
        "Orthoptera",
        "Hymenoptera",
        "Diptera"
    ],
    [
        "This Ottoman Sultan was known to the West as 'The Magnificent,' but among his own people, he was called Kanuni, meaning Lawgiver.",
        "Suleiman I",
        "Mehmed II",
        "Murad II",
        "Selim III"
    ],
    [
        "This fleet admiral who served the Yongle Emperor of China's Ming Dynasty led seven voyages from 1405 to 1433. On his final three voyages, he circumnavigated the horn of Africa.",
        "Zheng He",
        "Gan Ying",
        "Shen Kuo",
        "Yishiha"
    ],
    [
        "This Argentine author is best known for the short-story collections Ficciones and El Aleph.",
        "Jorge Luis Borges",
        "Julio Cortazar",
        "Manuel Puig",
        "Silvina Ocampo"
    ],
    [
        "This novel concerning the exploits of the eccentric Ignatius J Reilly won its author the 1981 Pulitzer Prize.",
        "A Confederacy of Dunces",
        "Rabbit is Rich",
        "American Pastoral",
        "The Orphan Master's Son"
    ],
    [
        "This revolutionary video game released in 1986 was the first console title that allowed players to save their progress.",
        "The Legend of Zelda",
        "Super Mario Bros",
        "Metroid",
        "Final Fantasy"
    ],
    [
        "This psychic villain from the Metal Gear series of games is famous for breaking the fourth wall. He could only be defeated by unplugging the controller.",
        "Psycho Mantis",
        "Mystic Scorpion",
        "Cerebral Octopus",
        "Mental Tarantula"
    ]
];

const game = {
    playerScore: 0,
    questions: [],
    loadQuestions: function () {
        const questionList = shuffle(qaArray.slice(0,10));
        for(i = 0; i < questionList.length; i++) {
            this.questions.push(makeQuestion(questionList[i][0],questionList[i][1],questionList[i][2],questionList[i][3],questionList[i][4]));
        }
    },
    reset: function() {
        this.playerScore = 0;
        this.questions = [];
    }
}

let currentIndex = -2;
let progressInterval;
let questionTimeout;
let betweenTimeout;
let betweenQuestions = false;
//How much time the user is given to answer each question
const questionTimeLimit = 30000;
//How long to wait between questions
const betweenQuestionTime = 5000;

//Controls question timeout and progress bar interval.
function countdown() {
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
        $("#progressBar").val(parseInt($("#progressBar").val())-1);
    },questionTimeLimit / 120);
    clearTimeout(questionTimeout);
    questionTimeout = setTimeout(nextQuestion("timeup"), questionTimeLimit);
}

function displayQuestion() {
    
    $("#questionHolder").empty();
    $("#questionHolder").text(game.questions[currentIndex].questionText);
    $("#choiceHolder").empty();
    $("#progressBar").val("120");
    game.questions[currentIndex].displayAnswerChoices().forEach(choice => {
        choiceButton = $("<button class = 'answerChoice'></button>");
        choiceButton.text(choice);
        choiceButton.val(choice);
        $("#choiceHolder").append(choiceButton);
    })
    countdown();
}

//Calls each time the user either answers a question or runs out of time.
//input will be one of: "timeup", true, or false.
function nextQuestion(input) {
    function next() {
        $("#questionDisplay").addClass("hidden");
        $("#textHolder").text("");
        $("#correctHolder").text("");
        if(input === "timeup") {
            $("#textHolder").text("Time up. Correct answer was: ");
            $("#correctHolder").text(game.questions[currentIndex].correctAnswer);
            
        }
        else if(input) {
            $("#textHolder").text("Correct");
            game.playerScore++;
        }
        else{
            $("#textHolder").text("Incorrect. Correct answer was: ")
            $("#correctHolder").text(game.questions[currentIndex].correctAnswer);
        }
        $("#between").removeClass("hidden");
        betweenQuestions = true;
        betweenTimeout = setTimeout(() => {
            currentIndex++;
            $("#between").addClass("hidden");
            if(currentIndex < 10) {
                $("#questionDisplay").removeClass("hidden");
                displayQuestion(currentIndex);
            }
            else {
                currentIndex = -1;
                $("#correctCount").text(game.playerScore);
                $("#results").removeClass("hidden");
                game.reset();
            }
        },betweenQuestionTime);
    }
    return next;
}

$(document).ready(function () {
    $(document).on("keyup", function () {
        if(currentIndex === -2) {
            $("#splashScreen").addClass("hidden");
            $("#instructions").removeClass("hidden");
            currentIndex++;
        }
        else if(currentIndex === -1) {
            $("#instructions").addClass("hidden");
            $("#results").addClass("hidden");
            $("#questionDisplay").removeClass("hidden");
            game.loadQuestions();
            currentIndex++;
            displayQuestion();
        }
        if(betweenQuestions) {
            clearTimeout(betweenTimeout);
            betweenQuestions = false;
            currentIndex++;
            $("#between").addClass("hidden");
            if(currentIndex < 10) {
                $("#questionDisplay").removeClass("hidden");
                displayQuestion(currentIndex);
            }
            else {
                currentIndex = -1;
                $("#correctCount").text(game.playerScore);
                $("#results").removeClass("hidden");
                game.reset();
            }
        }
    });
    $(document).on("click", ".answerChoice", function () {
        const newQuestion = nextQuestion($(this).val() === game.questions[currentIndex].correctAnswer);
        newQuestion();
    });
    
});