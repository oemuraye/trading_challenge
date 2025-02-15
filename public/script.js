document.getElementById("contact-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("submit-btn");
    const responseMsg = document.getElementById("response-msg");
    const errorMsg = document.getElementById("response-error-msg");

    // Clear previous messages
    responseMsg.innerText = "";
    errorMsg.innerText = "";

    // Convert form data to an object
    const formData = new FormData(this);
    const jsonData = Object.fromEntries(formData.entries());

    // Validate fields (Ensure required fields are not empty)
    for (const key in jsonData) {
        if (key !== "instagram_handle" && jsonData[key].trim() === "") {
            errorMsg.innerText = "All fields must be filled.";
            setTimeout(() => { errorMsg.innerText = ""; }, 5000); 
            return;
        }
    }


    // Show Bootstrap spinner and disable button
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...`;
    submitBtn.disabled = true;

    try {
        const response = await fetch("/submit-form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData),
        });

        const result = await response.json();
        responseMsg.innerText = result.message;

        // Reset form fields
        this.reset();

        // Hide success message after 5 seconds
        setTimeout(() => { responseMsg.innerText = ""; }, 5000);
    } catch (error) {
        console.error("Error:", error);
        errorMsg.innerText = "Error submitting form.";
        setTimeout(() => { errorMsg.innerText = ""; }, 5000);
    } finally {
        // Restore button text and enable it
        submitBtn.innerHTML = "Submit";
        submitBtn.disabled = false;
    }
});
