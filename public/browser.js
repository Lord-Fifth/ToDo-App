function itemTemplate(item) {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
        <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
        <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
    </li>
    `
}

//Create feature

let createField = document.getElementById("create-field")
document.getElementById("create-form").addEventListener("submit", function(e) {
    e.preventDefault()

    //Send new data to Node server using axios promise
    axios.post("/create-item", { text: createField.value }).then(function(response) {

        //Update User Interface with new data
        document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data))

        //Better User Experience
        createField.value = ""
        createField.focus()
    }).catch(function() {
        console.log("Please try again later.")
    })
})

//ToDo list buttons
document.addEventListener("click", function(e) {
    //Update feature
    if (e.target.classList.contains("edit-me")) {

        //Send prompt with pre-populated fields
        let userInput = prompt("Enter your desired new text", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)

        if (userInput) {
            //Send new data to Node server using axios promise
            axios.post("/update-item", { text: userInput, id: e.target.getAttribute("data-id") }).then(function() {

                //Update User Interface with new data
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
            }).catch(function() {
                console.log("Please try again later.")
            })
        }
    }

    //Delete feature
    if (e.target.classList.contains("delete-me")) {

        //Confirm prompt
        if (confirm("Do you really want to delete this item permanently?")) {
            //Send delete confirmation to Node server using axios promise
            axios.post("/delete-item", { id: e.target.getAttribute("data-id") }).then(function() {

                //Update User Interface by deleting item
                e.target.parentElement.parentElement.remove()
            }).catch(function() {
                console.log("Please try again later.")
            })
        }
    }
})