
let score = 0;
scoreList = [];
let time;
let timer;
scoreList = [];

const decrement = function() {
    if (time > 0) {
        time = time -1;
        $(".countdown-counter").empty().append(time);
    } else if (time <= 0) {
        endQuiz();
    }

}

// get the difficulty from the select input


const getQuestions = function() {
    var difficulty = $("#difficulty").val()
    var questionCategory = $("#category").val()
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

const showQuestions = function(data, questionNumber) {
    if (questionNumber == 15) {
        endQuiz();
        return;
    }
    $(".selections > form > button").prop( "disabled", true );
    $(".selections > form > select").prop( "disabled", true );
    $(".questions-container").empty().append(data.results[questionNumber].question);

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
    // create buttons
    $(".answers-container").empty();
    for (let i = 0; i < item.length; i++) {
        const button = $("<button>").html(item[i]).click(function() {
            if (this.innerText === data.results[questionNumber].correct_answer) {
                $(".answers-container").empty().append("Correct!");
                score = score + 25;
            } else {
                $(".answers-container").empty().append("Wrong!");
            }
            setTimeout(function(){
              questionNumber = questionNumber + 1;
              showQuestions(data, questionNumber);
            }, 2000)

        })
        $(".answers-container").append(button);
    }

}

endQuiz = function() {
    clearInterval(timer);

    $(".selections > form > button").prop( "disabled", false );
    $(".selections > form > select").prop( "disabled", false );
    $(".questions-container").empty();
    $(".answers-container").empty();

    score = score + time;
    
    let gifSearch = "";
    
    if (time == 0) {
      $(".countdown-counter").empty().append("Time's Up!");
      gifSearch = "timesup"
    } else {
      gifSearch = "congratulations ";
      score = score + time;
      console.log(`Score: ${score}`);
      
      
      // !!== hardcoded initials, make sure to use value of user input from modal when that's added ==!!
      let initials = "ABC"
      setHighScore(initials);
      
    }

    fetch(`https://api.giphy.com/v1/gifs/search?q=${gifSearch}&api_key=HvaacROi9w5oQCDYHSIk42eiDSIXH3FN`)
        .then(function(response){
            return response.json();
        })
  
    .then(function(response) {
        let num2 = Math.floor(Math.random() * 50);
        var gifImg = document.createElement('img');
        gifImg.setAttribute('src', response.data[num2].images.fixed_height.url);
        $('.questions-container').append(gifImg);
  });
};

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

const displayHighScore = function() {
  $("#high-scores").empty();
  for (let i = 0; i < 5; i++) {
    $("#high-scores").append(`<li>${scoreList[i].initials}, score: ${scoreList[i].score}</li>`);
  }
}

$("#start").on("click", function(){
  event.preventDefault();
  $(".countdown-counter").empty();
  getQuestions();
});
// 
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
    displayHighScore();
}

readFromStorage();