const inputs = document.querySelectorAll('.login-cred input');

inputs.forEach(input => {
    input.addEventListener('blur', (event) => {
        if (event.target.value.length) {
            event.target.classList.add("filled");
        } else {
            event.target.classList.remove("filled");
        }
    });
})
