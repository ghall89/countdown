// initialize global variables
let score = 0;
let scoreList = [];
let time;
let timer;

// game timer 
const decrement = function() {
    if (time > 0) {
        time = time -1;
        $(".countdown-counter").empty().append(time);
    } else if (time <= 0) {
        endQuiz();
    }

}

// make an api call using the user-selected category and difficulty level 

const getQuestions = function(difficulty, questionCategory) {

    const apiVariable = `https://opentdb.com/api.php?amount=15&category=${questionCategory}&difficulty=${difficulty}`;
    fetch(apiVariable).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                console.log(data);
                let questionNumber = 0;
                time = 150;
                $(".countdown-counter").empty().append(time);
                timer = setInterval(decrement, 1000);
                showQuestions(data, questionNumber);
            })
        } else {
            // Change to a modal
            alert("countDown is down");
        }
    });
};

// Display question text and answer buttons on page
const showQuestions = function(data, questionNumber) {
    // End quiz if all questions are answered
    if (questionNumber == 5) {
        endQuiz();
        return;
    }
    // disable game options
    $(".selections > form > button").prop( "disabled", true );
    $(".selections > form > select").prop( "disabled", true );
    $(".questions-container").empty().append(data.results[questionNumber].question);
    
    // take the correct answer and incorrect answers and store them in an array
    const answers = [];
    answers.push(data.results[questionNumber].correct_answer);
    for (let i = 0; i < data.results[questionNumber].incorrect_answers.length; i++) {
        answers.push(data.results[questionNumber].incorrect_answers[i]);
    }
    var item = []
    // randomize the answers for buttons
    while (answers.length > 0) {
    num = Math.floor(Math.random() * answers.length)
    item.push(answers[num]);
    answers.splice(num, 1);
    }
    // create and display buttons
    $(".answers-container").empty();
    for (let i = 0; i < item.length; i++) {
        const button = $("<button>").html(item[i]).click(function() {
            // compare text value of the clicked button to the correct answer
            if (this.innerText === data.results[questionNumber].correct_answer) {
                $(".answers-container").empty().append("Correct!");
                score = score + 25;
            } else {
                $(".answers-container").empty().append("Wrong!");
            }
            // move to next question
            setTimeout(function(){
              questionNumber = questionNumber + 1;
              showQuestions(data, questionNumber);
            }, 2000)

        })
        $(".answers-container").append(button);
    }

}

// Ends quiz, calculates score, and displays gif
endQuiz = function() {
    clearInterval(timer);
    // re-enable game options
    $(".selections > form > button").prop( "disabled", false );
    $(".selections > form > select").prop( "disabled", false );
    $(".questions-container").empty();
    $(".answers-container").empty();
    // calculate score
    score = score + time;
    
    // win or lose?
    let gifSearch = "";
    if (time == 0) {
      $(".countdown-counter").empty().append("Time's Up!");
      gifSearch = "timesup"
    } else {
      gifSearch = "congratulations ";
      score = score + time;
      console.log(`Score: ${score}`);
      // !- call modal here -!
    }
    // get a selection of gifs
    fetch(`https://api.giphy.com/v1/gifs/search?q=${gifSearch}&api_key=HvaacROi9w5oQCDYHSIk42eiDSIXH3FN`)
        .then(function(response){
            return response.json();
        })
  // Randomize gif and display
    .then(function(response) {
        let num2 = Math.floor(Math.random() * 50);
        var gifImg = document.createElement('img');
        gifImg.setAttribute('src', response.data[num2].images.fixed_height.url);
        $('.questions-container').append(gifImg);
  });
};

// Pushes the current score and the user's initials to 'scoreList'
const setHighScore = (initials) => {
  let highScore = {
    initials: initials,
    score: score
  };
  console.log(highScore);
  scoreList.push(highScore);
  writeToStorage();
  displayHighScore();
}


// Displays high score list on page
const displayHighScore = function() {
  $("#high-scores").empty();
  for (let i = 0; i < scoreList.length && i < 5; i++) {
    $("#high-scores").append(`<li>${scoreList[i].initials}, score: ${scoreList[i].score}</li>`);
  }
}

// -- Event Listeners --

// Get user input values and start the quiz
$("#start").on("click", function(){
  event.preventDefault();
  var difficulty = $("#difficulty").val()
  var questionCategory = $("#category").val()
  $(".countdown-counter").empty();
  getQuestions(difficulty, questionCategory);
});

// Check to see if user has entered 3 characters
$("#submit-btn").prop("disabled", true);

$(".initial").keyup(function() {

    let input = $(".initial").val();

    if (input.length < 3) {
        $("#submit-btn").prop("disabled", true);
    } else {
        $("#submit-btn").prop("disabled", false);
    }
});

// Submit button is clicked
$("#submit-btn").on("click", function(){
    event.preventDefault();
    var initialsStart = $(".initial").val();
    initials = initialsStart.substring(0,3);
    console.log(initials);
    console.log(this);

    setHighScore(initials);
});


// -- Local Storage --

// getQuestions();
// Write to localStorage ********************************
// Pass a full object array nameObjArry = [{initial: xyz, score: 123}, {initial: abc, score: 345}, .....]
var writeToStorage = function() {
    localStorage.setItem("scoreList", JSON.stringify(scoreList));
}

// Return what's stored in localStorage *******************************
var readFromStorage = function() {
    scoreList = JSON.parse(localStorage.getItem("scoreList"));
    console.log(scoreList);
    
    if (scoreList) {
      displayHighScore();
    }
}

readFromStorage();

