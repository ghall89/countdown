
const questions = function() {
    const apiVariable = `https://opentdb.com/api.php?amount=15&category=18&difficulty=easy`
    fetch(apiVariable).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                console.log(data);
            })
        } else {
            // Change to a modal
            alert("countDown is down");
        }
    });
}

questions();

