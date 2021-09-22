
"use strict";


///// will post the 'message' object (objData param) when fired

function postMessage(objData) {
    fetch("https://tiny-taco-server.herokuapp.com/test/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(objData),
    })
        .then((response) => {
            console.log(response.ok);
            if (!response.ok) {
                throw new Error("Ooops! Something went wrong", response.status); // This is because a 404 does not constitute a network error
            }
            return response.json();
        })
        .then((data) => console.log(data))
        .catch((error) => console.log(error))
        .finally(() => console.log("API's are awesome!"));
}

// will retrieve messages from backend when fired

function getMessagesToDisplay() {
    fetch("https://tiny-taco-server.herokuapp.com/test/")
        .then((response) => response.json())
        .then((data) =>  insertMessages(data));
}


function insertMessages(arr) {
    let str;

    arr.sort((elem1, elem2) => {
        return elem1.created_at.split(".")[0].replace("T", "").replace(":", "").replace("-", "").replace("-", "").replace(":", "") - elem2.created_at.split(".")[0].replace("T", "").replace(":", "").replace("-", "").replace("-", "").replace(":", "");
    })
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id % 2 == 0) {
            str = `<section class="message -right">
            <div class="nes-balloon from-right is-dark">
            <div class="exit-message">X</div>
              <p>${arr[i].name}: ${arr[i].text}.</p>
            </div>
          </section>`
        } else {
            str = `<section class="message -left">
            <div class="nes-balloon from-left is-dark">
            <div class="exit-message">X</div>
              <p>${arr[i].name}: ${arr[i].text}.</p>
            </div>
          </section>`
        }
        
        messageDisplay.insertAdjacentHTML('beforeend', str)

    }
}

function getMessagesForDeletion() {
    fetch("https://tiny-taco-server.herokuapp.com/test/")
    .then((response) => response.json())
    .then((data) =>  deleteEntries(data));
}

function deleteEntries(arr) {

    for (let i = 0; i < arr.length; i++) {
        fetch(`https://tiny-taco-server.herokuapp.com/test/${arr[i].id}`, {
            method: 'DELETE',
        })
        .then(response => {
            console.log(response);
            if (!response.ok) {
                throw new Error('Ooops! Something went wrong'); // This is because a 404 does not constitute a network error
            }
            console.log('Record was deleted!!')
        });
    }
}



/////////// DOM MANIPULATION ///////////

const message = {};

const submitBtn = document.querySelector(".submit-btn");
const nameArea = document.querySelector(".name-area");
const messageArea = document.querySelector(".message-area");
const messageDisplay = document.querySelector(".message-list");
const clearLogBtn = document.querySelector(".clear-log");
const screen = document.querySelector(".nes-container");
const exitBtn = document.querySelector(".exit-message");

submitBtn.addEventListener("click", (event) => {
    message["name"] = nameArea.value;
    message["text"] = messageArea.value;

    postMessage(message);
    setTimeout(() => {
        messageDisplay.innerHTML = "";
        getMessagesToDisplay();
    }, 500)
    nameArea.value = "";
    messageArea.value = "";
    event.preventDefault;
});

clearLogBtn.addEventListener('click', event => {
    messageDisplay.style.color = 'red';
    messageDisplay.innerHTML = "DELETING MESSAGES";
    getMessagesForDeletion();
    clearLogBtn.classList.add('is-warning');
    setTimeout(() => {
        messageDisplay.innerHTML = "";
        messageDisplay.style.color = 'white';
        getMessagesToDisplay();
        clearLogBtn.classList.remove('is-warning');
    }, 3000)
    clearBtnProcessing();
    nameArea.value = "";
    messageArea.value = "";
    event.preventDefault;
})



setInterval(() => {
    console.log(messageDisplay);
    messageDisplay.innerHTML = "";
    getMessagesToDisplay();
}, 4000);