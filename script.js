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
    
    // Auto-scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // Show loading indicator
        chatBox.innerHTML += `<p class="loading"><em>AI is thinking...</em></p>`;

        const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/llama-3-8b-chat-hf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                inputs: {
                    text: userMessage,
                    max_length: 1000,
                    temperature: 0.7,
                    top_p: 0.9,
                    do_sample: true
                }
            })
        });

        // Remove loading indicator
        chatBox.innerHTML = chatBox.innerHTML.replace('<p class="loading"><em>AI is thinking...</em></p>', '');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        let botMessage = data.generated_text || "I apologize, but I'm having trouble understanding that.";
        
        // Clean up the response to remove any repeated user message
        if (botMessage.includes(userMessage)) {
            botMessage = botMessage.replace(userMessage, '').trim();
        }

        // Display bot response
        chatBox.innerHTML += `<p><strong>AI:</strong> ${botMessage}</p>`;
    } catch (error) {
        console.error('Error:', error);
        chatBox.innerHTML = chatBox.innerHTML.replace(
            '<p class="loading"><em>AI is thinking...</em></p>',
            `<p><strong>AI:</strong> I apologize, but I'm experiencing technical difficulties. Please try again.</p>`
        );
    }

    // Auto-scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Add event listener for Enter key
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
