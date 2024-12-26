// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const apiKey = 'hf_yJNnOtFwQhIjYeOkwksoah31cldWJOeIXuN'; // Replace with your actual API key
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
        const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                inputs: userMessage,
                parameters: {
                    max_new_tokens: 150,
                    temperature: 0.7,
                    top_p: 0.9
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const botMessage = data?.[0]?.generated_text || "I'm sorry, I couldn't understand that.";

        // Display bot response
        chatBox.innerHTML += `<p><strong>AI:</strong> ${botMessage}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        console.error('Error:', error);
        chatBox.innerHTML += `<p><strong>AI:</strong> Oops! Something went wrong. Please try again later.</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
