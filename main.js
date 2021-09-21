
"use strict";




// fetch('http://tiny-taco-server.herokuapp.com/nintendo/', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(todo),
// })

// .then(response => {
//     console.log(response.ok)
//     if (!response.ok) {
//         throw new Error('Ooops! Something went wrong', response.status); // This is because a 404 does not constitute a network error
//     }
//     return response.json()
// })
// .then(data => console.log(data))
// .catch(error => console.log(error))
// .finally(() => console.log('API\'s are awesome!'));
// a successful post response gives you back the item you just added to the database

//////////////// DELETE REQUEST ////////////////////

//When you delete from a database, it needs to know the exact record -- ID

// fetch('http://tiny-taco-server.herokuapp.com/cohort10/1', {
//     method: 'DELETE',
// })
// .then(response => {
//     console.log(response);
//     if (!response.ok) {
//         throw new Error('Ooops! Something went wrong'); // This is because a 404 does not constitute a network error
//     }
//     console.log('Record was deleted!!')
// })

/////////////////// PUT REQUEST /////////////////////

// fetch( 'http://tiny-taco-server.herokuapp.com/cohort10/17', {
//     method: 'PUT',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(todo),
// })
// .then(response => response.json())
// .then(data => console.log(data))




///// will post the 'message' object (objData param) when fired

function postMessage(objData) {
    fetch("http://tiny-taco-server.herokuapp.com/test/", {
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

function getMessagesForDisplay() {
    fetch("http://tiny-taco-server.herokuapp.com/test/")
        .then((response) => response.json())
        .then((data) =>  displayMessages(data));
}


function displayMessages(arr) {
    let str;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id % 2 == 0) {
            str = `<section class="message -right">
            <div class="nes-balloon from-right is-dark">
              <p>${arr[i].name}: ${arr[i].text}.</p>
            </div>
          </section>`
        } else {
            str = `<section class="message -left">
            <div class="nes-balloon from-left is-dark">
              <p>${arr[i].name}: ${arr[i].text}.</p>
            </div>
          </section>`
        }

        messageDisplay.insertAdjacentHTML('beforeend', str)

    }
}

function getMessagesForDeletion() {
    fetch("http://tiny-taco-server.herokuapp.com/test/")
    .then((response) => response.json())
    .then((data) =>  deleteEntries(data));
}

function deleteEntries(arr) {

    for (let i = 0; i < arr.length; i++) {
        fetch(`http://tiny-taco-server.herokuapp.com/test/${arr[i].id}`, {
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

submitBtn.addEventListener("click", (event) => {
    message["name"] = nameArea.value;
    message["text"] = messageArea.value;

    postMessage(message);
    setTimeout(() => {
        messageDisplay.innerHTML = "";
        getMessagesForDisplay();
    }, 100)

    event.preventDefault;
});

clearLogBtn.addEventListener('click', event => {
    getMessagesForDeletion();
    event.preventDefault;
})
