// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const part1 = 'sk-proj-993ph62s9xbQIa';
const part2 = 'eiqoNRjY1POLow1CoF08qiDx2Rpn5fMVhL0LTLFrIP';
const part3 = 'c0wq4wTw9acJWsJ2LqT3BlkFJ7T0b6aRzHrer5';
const part4 = '1kU7GmBnWP8GcKSezGEMrRyjUTQdeVakDzGLnz2';
const part5 = 'aeW0r3ZLedRzWHxFqtzQA';


const apiKey = `${part1}${part2}${part3}${part4}${part5}`;
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

