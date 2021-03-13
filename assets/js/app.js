
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