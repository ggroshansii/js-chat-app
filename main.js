
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
    messageDisplay.innerHTML = "";
    let str;

    arr.sort((elem1, elem2) => {
        return elem1.created_at - elem2.created_at;
    })
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id % 2 == 0) {
            str = `<section class="message -right">
            <div class="nes-balloon from-right is-dark">
            <div class="icon-div">
            <div class="edit-message" id="${arr[i].id}"><i class="far fa-edit"></i></div>
            <div class="exit-message" id="${arr[i].id}">X</div>
            </div>
              <p>${arr[i].name}: ${arr[i].text}.</p>
            </div>
          </section>`
        } else {
            str = `<section class="message -left">
            <div class="nes-balloon from-left is-dark" >
            <div class="icon-div">
            <div class="edit-message" id="${arr[i].id}"><i class="far fa-edit"></i></div>
            <div class="exit-message" id="${arr[i].id}">X</div>
            </div>
              <p>${arr[i].name}: ${arr[i].text}.</p>
            </div>
          </section>`
        }
        messageDisplay.insertAdjacentHTML('beforeend', str)

    }
   createNewExitBtnEvents();
   createNewEditBtnEvents();
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

const submitEditBtn = document.querySelector(".submit-edit-btn");
const submitBtn = document.querySelector(".submit-btn");
const nameArea = document.querySelector(".name-area");
const messageArea = document.querySelector(".message-area");
const messageDisplay = document.querySelector(".message-list");
const clearLogBtn = document.querySelector(".clear-log");
const screen = document.querySelector(".nes-container");
let exitBtns;
let editBtns; 


submitBtn.addEventListener("click", (event) => {
    message["name"] = nameArea.value;
    message["text"] = messageArea.value;

    postMessage(message);
    setTimeout(() => {
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
        messageDisplay.style.color = 'white';
        getMessagesToDisplay();
        clearLogBtn.classList.remove('is-warning');
    }, 3000)
    clearBtnProcessing();
    nameArea.value = "";
    messageArea.value = "";
    event.preventDefault;
})

window.addEventListener('load', (event) => {
    getMessagesForDeletion();
  });

function createNewExitBtnEvents() {

        exitBtns = document.querySelectorAll(".exit-message");
        exitBtns.forEach(btn => btn.addEventListener('click', event => {


            fetch(`https://tiny-taco-server.herokuapp.com/test/${event.currentTarget.id}`, {
                method: 'DELETE',
            })
            .then(response => {
                console.log(response);
                if (!response.ok) {
                    throw new Error('Ooops! Something went wrong'); // This is because a 404 does not constitute a network error
                }
                console.log('Record was deleted!!');
                getMessagesToDisplay();
            })
        }))  
}

function createNewEditBtnEvents() {

        editBtns = document.querySelectorAll(".edit-message");
        editBtns.forEach(btn => btn.addEventListener('click', event => {
            submitBtn.style.display = 'none';
            submitEditBtn.style.display = 'block';

            let messageTarget = event.currentTarget.id;
            console.log(event.currentTarget.id);
            fetch(`https://tiny-taco-server.herokuapp.com/test/${event.currentTarget.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name:'EDIT', text: 'Submit new message edit below'}),
            })
            .then(response => {
                console.log(response);
                console.log('Record was updated!!');
                getMessagesToDisplay();
            })

            submitEditBtn.addEventListener("click", (event) => {
                message["name"] = nameArea.value;
                message["text"] = messageArea.value;
                

                    fetch(`https://tiny-taco-server.herokuapp.com/test/${messageTarget}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(message),
                    })
                    .then(response => {
                        console.log(response);
                        console.log('Record was updated!!');
                        getMessagesToDisplay();
                    })

                setTimeout(() => {
                    nameArea.value = "";
                    messageArea.value = "";
                    submitBtn.style.display = 'block';
                    submitEditBtn.style.display = 'none';
                    event.preventDefault;
                }, 0)


            });
        }))  
}


setInterval(() => {
    console.log(messageDisplay);
    getMessagesToDisplay();
}, 5000);