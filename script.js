const headerTexts = ["I am Asif.", "This is my website."]
const speed = 100;
const pauseTime = 500; // Pause time between each text

let textIndex = 0;
let charIndex = 0;
let isBackspace = false;


// Typing effect function
function typeWriter() {
    const currentText = headerTexts[textIndex];
    const element = document.getElementById("typed-header");

    if (isBackspace) {
        element.innerHTML = currentText.substring(0, charIndex--);
    } else {
        element.innerHTML = currentText.substring(0, charIndex++);
    }

    const typeSpeed = isBackspace ? speed * 2 : speed;
    setTimeout(typeWriter, typeSpeed);

    if (!isBackspace && charIndex === currentText.length) {
        setTimeout(() =>{
            isBackspace = true;
        }, pauseTime);
    } else if (isBackspace && charIndex === 0) {
        isBackspace = false;
        textIndex = (textIndex + 1) % headerTexts.length;
    }
}

// Initialize typing effect for header
window.onload = function() {
    typeWriter();
};

// Tab switching logic
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');

    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    buttons.forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
}