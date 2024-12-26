// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const apiKey = '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'; // Your new API key
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
        let retries = 3; // Retry up to 3 times if the model is loading
        while (retries > 0) {
            const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b', {
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

            const data = await response.json();
            console.log('API Response:', data); // Log the raw response for debugging

            if (data.error && data.error.includes('loading')) {
                console.warn('Model is loading, retrying in 20 seconds...');
                await new Promise(res => setTimeout(res, 20000)); // Wait 20 seconds before retrying
                retries--;
            } else if (data.generated_text) {
                const botMessage = data.generated_text;
                chatBox.innerHTML += `<p><strong>AI:</strong> ${botMessage}</p>`;
                chatBox.scrollTop = chatBox.scrollHeight;
                return;
            } else if (data[0]?.generated_text) {
                const botMessage = data[0].generated_text;
                chatBox.innerHTML += `<p><strong>AI:</strong> ${botMessage}</p>`;
                chatBox.scrollTop = chatBox.scrollHeight;
                return;
            } else if (data.error) {
                throw new Error(`API Error: ${data.error}`);
            }
        }

        chatBox.innerHTML += `<p><strong>AI:</strong> Model failed to load after multiple attempts. Please try again later.</p>`;
    } catch (error) {
        console.error('Error:', error);
        chatBox.innerHTML += `<p><strong>AI:</strong> Oops! ${error.message}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Enable Enter key to send messages
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default Enter key behavior (e.g., adding a newline)
        sendMessage();
    }
});
