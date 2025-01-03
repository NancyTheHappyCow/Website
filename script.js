// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const apiKey = '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'; // Your API Key
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
        // Structured prompt for Mistral-7B-Instruct
        const prompt = `You are a helpful assistant.\nUser: ${userMessage}\nAssistant:`;

        const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-Nemo-Instruct-2407', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 150,
                    temperature: 0.7,
                    top_p: 0.9,
                    do_sample: true
                }
            })
        });

        const data = await response.json();
        console.log('API Response:', data);

        let botMessage = "I'm sorry, I couldn't understand that.";

        // Safely check if generated_text exists
        if (data.generated_text) {
            botMessage = data.generated_text.split('Assistant:')[1]?.trim() || botMessage;
        } else if (Array.isArray(data) && data[0]?.generated_text) {
            botMessage = data[0].generated_text.split('Assistant:')[1]?.trim() || botMessage;
        } else if (data.error) {
            throw new Error(`API Error: ${data.error}`);
        }

        // Display bot response
        chatBox.innerHTML += `<p><strong>AI:</strong> ${botMessage}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        console.error('Error:', error);
        chatBox.innerHTML += `<p><strong>AI:</strong> Oops! ${error.message}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Enable Enter key to send messages
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});
