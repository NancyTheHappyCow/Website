// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const apiKey = 'hf_yJNnOtFwQhIjvOekWsoah31cWdJWOeIXuN'; // Replace with your actual API key
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Display user message
    chatBox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
    userInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/llama-3-8b-chat-hf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                inputs: userMessage
            })
        });

        const data = await response.json();
        const botMessage = data.generated_text || "I'm sorry, I couldn't understand that.";

        // Display bot response
        chatBox.innerHTML += `<p><strong>AI:</strong> ${botMessage}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        console.error('Error:', error);
        chatBox.innerHTML += `<p><strong>AI:</strong> Oops! Something went wrong.</p>`;
    }
}
