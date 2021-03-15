
let score = 0;
let time;
let timer;

const decrement = function() {
    if (time > 0) {
        $(".countdown-counter").empty().append(time);
        time = time -1;
        console.log(time);
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
                console.log(data.results[0].question);
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
    $(".selections > form").css("visibility", "hidden");
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
    console.log(item);
    }
    // create buttons
    console.log(answers);
    $(".answers-container").empty();
    for (let i = 0; i < item.length; i++) {
        const button = $("<button/>").text(item[i]).click(function() {
            console.log(this.innerText);
            if (this.innerText === data.results[questionNumber].correct_answer) {
                $(".answers-container").empty().append("Correct!");
                score = score + 25;
                console.log(score);
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
    $(".selections  > form").css("visibility", "visible");
    $(".questions-container").empty();
    $(".answers-container").empty();

    score = score + time;
    
    let gifSearch = "";
    
    if (time == 0) {
      gifSearch = "timesup"
    } else {
      gifSearch = "congratulations ";
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


$("#start").on("click", function(){
  event.preventDefault();
  getQuestions();
});
// 
// getQuestions();
// Write to localStorage ********************************
// Pass a full object array nameObjArry = [{initial: xyz, score: 123}, {initial: abc, score: 345}, .....]
var writeToStorage = function(nameObjArry) {
    localStorage.setItem("scoreList", JSON.stringify(nameObjArry));
}

// Return what's stored in localStorage *******************************
var readFromStorage = function() {
    let scoreList = JSON.parse(localStorage.getItem("scoreList"));
    return scoreList; // an object array
}
