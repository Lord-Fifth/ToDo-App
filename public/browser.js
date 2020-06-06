//Updating items in todo list
document.addEventListener("click", function(e) {
    //Run if Edit button is clicked
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
})