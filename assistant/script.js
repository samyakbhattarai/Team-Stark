

let messageId = 0;
const API_KEY = "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";

// Initialize chat
document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // Set initial timestamp for welcome message
    updateTimestamp();
    
    // Add event listeners
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    userInput.addEventListener('input', function() {
        const hasText = this.value.trim().length > 0;
        sendButton.disabled = !hasText;
    });
    
    // Initial button state
    sendButton.disabled = true;
});

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addMessage(message, true);
    
    // Clear input
    userInput.value = '';
    document.getElementById('send-button').disabled = true;
    
    // Show typing indicator
    showTypingIndicator();
    
    // Check if this is an assignment-related query
    const assignmentResponse = handleAssignmentQuery(message);
    if (assignmentResponse) {
        hideTypingIndicator();
        addMessage(assignmentResponse, false);
        return;
    }
    
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": "http://localhost",
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: message+"(the above query is from a student. Generate educational response student,give straight answers with no complications.)" }
                ]
            })
        });

        const data = await response.json();
        hideTypingIndicator();

        if (data.choices && data.choices.length > 0) {
            const reply = data.choices[0].message.content;
            addMessage(reply, false);
        } else {
            addMessage("Sorry, I couldn't process your request. Please try again.", false);
        }
    } catch (error) {
        hideTypingIndicator();
        addMessage("Connection error. Please check your internet and try again.", false);
    }
}

function addMessage(text, isUser) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    const timestamp = getCurrentTime();
    
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.innerHTML = `
        <div class="message-bubble">
            <p>${escapeHtml(text)}</p>
            <span class="timestamp">${timestamp}</span>
        </div>
    `;
    
    chatBox.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.classList.remove('hidden');
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.classList.add('hidden');
}


function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

function updateTimestamp() {
    const timestamp = document.querySelector('.timestamp');
    if (timestamp) {
        timestamp.textContent = getCurrentTime();
    }
}

function scrollToBottom() {
    const chatBox = document.getElementById('chat-box');
    setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 100);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle window resize
window.addEventListener('resize', function() {
    scrollToBottom();
});

// Auto-focus input on page load
window.addEventListener('load', function() {
    document.getElementById('user-input').focus();
});

// Assignment handling functions
function handleAssignmentQuery(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for assignment-related keywords
    const assignmentKeywords = [
        'assignment', 'homework', 'task', 'project', 'gravitation', 'organic', 
        'integration', 'desh ko maya', 'soft storm', 'physics', 'chemistry', 
        'calculus', 'nepali', 'english', 'what is', 'explain', 'help with'
    ];
    
    const isAssignmentQuery = assignmentKeywords.some(keyword => 
        lowerMessage.includes(keyword)
    );
    
    if (!isAssignmentQuery) {
        return null;
    }
    
    // Search for specific assignment
    const assignment = searchAssignment(message);
    
    if (assignment) {
        return formatAssignmentResponse(assignment);
    }
    
    // If no specific assignment found, provide general assignment info
    if (lowerMessage.includes('assignment') || lowerMessage.includes('homework')) {
        return formatAllAssignmentsResponse();
    }
    
    return null;
}

function formatAssignmentResponse(assignment) {
    return `📚 **${assignment.title} Assignment**

**Subject:** ${assignment.subject}
**Teacher:** ${assignment.teacher}
**Due Date:** ${assignment.dueDate}
**Difficulty:** ${assignment.difficulty}
**Estimated Time:** ${assignment.estimatedTime}

**Description:**
${assignment.description}

**Assignment Goals:**
${assignment.goals.map(goal => `• ${goal}`).join('\n')}

**Topics Covered:**
${assignment.topics.map(topic => `• ${topic}`).join('\n')}

**Tips for Success:**
• Start early to manage your time effectively
• Review the relevant textbook chapters
• Practice similar problems before attempting the assignment
• Don't hesitate to ask your teacher (${assignment.teacher}) for clarification

Would you like me to help you with any specific part of this assignment?`;
}

function formatAllAssignmentsResponse() {
    const allAssignments = getAllAssignments();
    const pendingAssignments = allAssignments.filter(assignment => 
        !assignment.dueDate.toLowerCase().includes('completed')
    );
    
    let response = `📋 **Your Current Assignments**\n\n`;
    
    if (pendingAssignments.length === 0) {
        response += "Great job! You have no pending assignments. 🎉";
    } else {
        pendingAssignments.forEach(assignment => {
            response += `**${assignment.title}** (${assignment.subject})\n`;
            response += `Due: ${assignment.dueDate}\n`;
            response += `Teacher: ${assignment.teacher}\n\n`;
        });
        
        response += `You can ask me about any specific assignment by name (e.g., "Tell me about the gravitation assignment" or "Help with organic chemistry assignment").`;
    }
    
    return response;
}