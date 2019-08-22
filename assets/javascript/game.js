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
    /*
        While tempArray is not empty, do the following:
        1. Generate a random index (from 0 to tempArray.length-1)
        2. Switch the value at randIndex with the last index in the array.
        3. pop tempArray and store the popped value in shuffledArray.
    */
    while(tempArray.length > 0) {
        const randIndex = Math.floor(Math.random()*tempArray.length);
        const temp = tempArray[randIndex];
        tempArray[randIndex] = tempArray[tempArray.length-1];
        tempArray[tempArray.length-1] = temp;
        shuffledArray.push(tempArray.pop());
    }
    return shuffledArray;
}

//Stores all questions. 
qaArray = [
    ["q1","a","b","c","d"],
    ["q2","a","b","c","d"],
    ["q3","a","b","c","d"],
    ["q4","a","b","c","d"],
    ["q5","a","b","c","d"],
    ["q6","a","b","c","d"],
    ["q7","a","b","c","d"],
    ["q8","a","b","c","d"],
    ["q9","a","b","c","d"],
    ["q10","a","b","c","d"]
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
let interval;
let timeout;

function countdown() {
    clearInterval(interval);
    interval = setInterval(() => {
        $("#progressBar").val(parseInt($("#progressBar").val())-1);
    },250);
    clearTimeout(timeout);
    timeout = setTimeout(nextQuestion("timeup"), 30000);
}

function displayQuestion() {
    
    $("#choiceHolder").empty();
    $("#progressBar").val(120);
    game.questions[currentIndex].displayAnswerChoices().forEach(choice => {
        choiceButton = $("<button class = 'answerChoice'></button>");
        choiceButton.text(choice);
        choiceButton.val(choice);
        $("#choiceHolder").append(choiceButton);
    })
    countdown();
}

function nextQuestion(input) {
    function next() {
        currentIndex++;
        if(input === "timeup") {
            $("#timeUp").removeClass("hidden");
            $("#questionDisplay").addClass("hidden");
            setTimeout(() => {
                $("#timeUp").addClass("hidden");
                $("#questionDisplay").removeClass("hidden");
            },5000);
        }
        else if(input) {
            game.playerScore++;
            $("#rightAnswer").removeClass("hidden");
            $("#questionDisplay").addClass("hidden");
            setTimeout(() => {
                $("#rightAnswer").addClass("hidden");
                $("#questionDisplay").removeClass("hidden");
            },5000);
        }
        else{
            $("#wrongAnswer").removeClass("hidden");
            $("#questionDisplay").addClass("hidden");
            setTimeout(() => {
                $("#wrongAnswer").addClass("hidden");
                $("#questionDisplay").removeClass("hidden");
            },5000);
        }
        if(currentIndex < 10) {
            displayQuestion(currentIndex);
        }
        else{
            $("#questionDisplay").addClass("hidden");
            console.log(game.playerScore);
        }
    }
    return next;
}

$(document).ready(function () {
game.loadQuestions();
    $(document).on("keyup", function () {
        if(currentIndex === -2) {
            $("#splashScreen").addClass("hidden");
            $("#instructions").removeClass("hidden");
            currentIndex++;
        }
        else if(currentIndex === -1) {
            $("#instructions").addClass("hidden");
            $("#questionDisplay").removeClass("hidden");
            currentIndex++;
            displayQuestion();
        }
    });
    $(document).on("click", ".answerChoice", function () {
        const newQuestion = nextQuestion($(this).val() === game.questions[currentIndex].correctAnswer);
        newQuestion();
    });
});