const whatsappInput = document.getElementById("whatsapp");
let iti;

document.addEventListener("DOMContentLoaded", function () {
    iti = window.intlTelInput(whatsappInput, {
        initialCountry: "ng",
        loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.0/build/js/utils.js"),
    });
});


document.getElementById("contact-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const fullNumber = iti.getNumber();
    whatsappInput.value = fullNumber;

    const submitBtn = document.getElementById("submit-btn");
    const responseMsg = document.getElementById("response-msg");
    const errorMsg = document.getElementById("response-error-msg");

    responseMsg.innerText = "";
    errorMsg.innerText = "";

    const formData = new FormData(this);
    const jsonData = Object.fromEntries(formData.entries());

    for (const key in jsonData) {
        if (key !== "instagram_handle" && jsonData[key].trim() === "") {
            showMessage("error", "All fields must be filled!");
            return;
        }
    }

    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...`;
    submitBtn.disabled = true;

    try {
        const response = await fetch("/submit-form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData),
        });

        const result = await response.json();
        showMessage("success", result.message);        

        this.reset();
    } catch (error) {
        console.error("Error:", error);
        showMessage("error", "Error submitting form!");
    } finally {
        submitBtn.innerHTML = "Submit";
        submitBtn.disabled = false;
    }
});


function showMessage(type, message) {
    const successMsg = document.getElementById("response-msg");
    const errorMsg = document.getElementById("response-error-msg");

    successMsg.classList.remove("show");
    errorMsg.classList.remove("show");

    if (type === "success") {
        successMsg.innerText = message;
        successMsg.classList.add("show");
    } else if (type === "error") {
        errorMsg.innerText = message;
        errorMsg.classList.add("show");
    }

    setTimeout(() => {
        successMsg.classList.remove("show");
        errorMsg.classList.remove("show");
    }, 5000);
}
