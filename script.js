// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const apiKey = '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'; // Replace with your actual API key
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
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: userMessage }]
            })
        });

        const data = await response.json();
        const botMessage = data.choices[0]?.message?.content || "I'm sorry, I couldn't understand that.";

        // Display bot response
        chatBox.innerHTML += `<p><strong>AI:</strong> ${botMessage}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        console.error('Error:', error);
        chatBox.innerHTML += `<p><strong>AI:</strong> Oops! Something went wrong.</p>`;
    }
}

