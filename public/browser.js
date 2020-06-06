//Updating items in todo list
document.addEventListener("click", function(e) {
    //Run if Edit button is clicked
    if (e.target.classList.contains("edit-me")) {
        let userInput = prompt("Enter your desired new text")

        //Send data to Node server using axios promise
        axios.post("/update-item", { text: userInput }).then(function() {
            //Next step
        }).catch(function() {
            console.log("Please try again later.")
        })
    }
})