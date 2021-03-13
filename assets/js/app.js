
let userScore = 0;

const getQuestions = function() {
    const apiVariable = `https://opentdb.com/api.php?amount=15&category=18&difficulty=easy`
    fetch(apiVariable).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                console.log(data);
                let questionNumber = 0;
                console.log(data.results[0].question);
                showQuestions(data, questionNumber);
            })
        } else {
            // Change to a modal
            alert("countDown is down");
        }
    });
};

const showQuestions = function(data, questionNumber) {
    $(".questions-container").empty().append(data.results[questionNumber].question);

    const answers = [];
    answers.push(data.results[questionNumber].correct_answer);
    for (let i = 0; i < data.results[questionNumber].incorrect_answers.length; i++) {
        answers.push(data.results[questionNumber].incorrect_answers[i]);
    }
    console.log(answers);
    $(".answers-container").empty();
    for (let i = 0; i < answers.length; i++) {
        const button = $("<button/>").text(answers[i]).click(function() {
            console.log(this.innerText);
            if (this.innerText === data.results[questionNumber].correct_answer) {
                console.log("Correct answer");
                userScore = userScore + 25;
                console.log(userScore);
                questionNumber = questionNumber + 1;
                setTimeout(showQuestions, 3000);
            } else {
                console.log("WRONG!");
                questionNumber = questionNumber + 1;
                setTimeout(showQuestions, 3000);
            }
        })
        $(".answers-container").append(button);
    }

}

getQuestions();

