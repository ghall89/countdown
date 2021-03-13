
const getQuestions = function() {
    const apiVariable = `https://opentdb.com/api.php?amount=15&category=18&difficulty=easy`
    fetch(apiVariable).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                console.log(data);

                console.log(data.results[0].question);
                showQuestions(data);
            })
        } else {
            // Change to a modal
            alert("countDown is down");
        }
    });
};

const showQuestions = function(data) {
    $(".questions-container").empty().append(data.results[0].question);

    const answers = [];
    answers.push(data.results[0].correct_answer);
    for (let i = 0; i < data.results[0].incorrect_answers.length; i++) {
        answers.push(data.results[0].incorrect_answers[i]);
    }
    console.log(answers);
    $(".answers-container").empty();
    for (let i = 0; i < answers.length; i++) {
        const button = $("<button/>").text(answers[i]).click(function() {
            console.log("It's working");
        })
        $(".answers-container").append(button);
    }
}

getQuestions();

