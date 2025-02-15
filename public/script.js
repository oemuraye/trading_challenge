document.getElementById("contact-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const jsonData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/submit-form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData),
        });

        const result = await response.json();
        document.getElementById("response-message").innerText = result.message;
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("response-message").innerText = "Error submitting form.";
    }
});
