// AI Service Class
class AIService {
    constructor() {
        this.n8nWebhookUrl = localStorage.getItem('n8nWebhookUrl') || '';
        this.geminiApiKey = localStorage.getItem('geminiApiKey') || '';
    }

    updateConfig(n8nUrl, geminiKey) {
        this.n8nWebhookUrl = n8nUrl;
        this.geminiApiKey = geminiKey;
        localStorage.setItem('n8nWebhookUrl', n8nUrl);
        localStorage.setItem('geminiApiKey', geminiKey);
    }

    async processStudentQuery(query) {
        try {
            // First, try to use n8n workflow if available
            if (this.n8nWebhookUrl && this.n8nWebhookUrl.trim() !== '') {
                return await this.processWithN8N(query);
            }
            
            // Fallback to direct Gemini API call
            return await this.processWithGemini(query);
        } catch (error) {
            console.error('Error processing query:', error);
            return this.getFallbackResponse(query);
        }
    }

    async processWithN8N(query) {
        const response = await fetch(this.n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                mode: 'study_assistant',
                guidelines: {
                    no_direct_answers: true,
                    provide_hints: true,
                    encourage_thinking: true,
                    prevent_plagiarism: true
                }
            })
        });

        if (!response.ok) {
            throw new Error('N8N webhook failed');
        }

        const data = await response.json();
        return data.response || data.message || 'I apologize, but I couldn\'t process your request right now.';
    }

    async processWithGemini(query) {
        if (!this.geminiApiKey || this.geminiApiKey.trim() === '') {
            return this.getFallbackResponse(query);
        }

        const prompt = this.buildStudyAssistantPrompt(query);
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            throw new Error('Gemini API failed');
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || this.getFallbackResponse(query);
    }

    buildStudyAssistantPrompt(query) {
        return `You are a study assistant designed to help students learn without enabling plagiarism. Your role is to:

1. NEVER provide direct answers or complete solutions
2. Give hints, clues, and guiding questions instead
3. Encourage critical thinking and step-by-step reasoning
4. Explain concepts and methodologies rather than giving final answers
5. Suggest study strategies and learning approaches
6. Help students understand the "why" behind concepts

Student's question: "${query}"

Respond with helpful hints and guidance that will lead the student to discover the answer themselves. Focus on teaching the underlying concepts and thinking processes. If this appears to be a homework question, provide study guidance rather than solutions.

Your response should be educational, encouraging, and focused on learning rather than providing ready-made answers.`;
    }

    getFallbackResponse(query) {
        // Analyze the query to provide contextual fallback responses
        const lowerQuery = query.toLowerCase();
        
        if (lowerQuery.includes('math') || lowerQuery.includes('equation') || lowerQuery.includes('calculate')) {
            return `I can see you're working on a math problem! Instead of giving you the answer, let me guide you:

1. What type of problem is this? (algebra, geometry, calculus, etc.)
2. What formulas or concepts might be relevant?
3. Can you break the problem into smaller steps?
4. What information are you given, and what do you need to find?

Try working through these questions, and feel free to ask about specific concepts you're unsure about!`;
        }
        
        if (lowerQuery.includes('essay') || lowerQuery.includes('write') || lowerQuery.includes('paper')) {
            return `For writing assignments, I can help you develop your ideas:

1. What's your main topic or thesis?
2. What key points do you want to make?
3. What evidence or examples support your arguments?
4. How can you organize your thoughts logically?

I can help you brainstorm, outline, or understand writing techniques, but the ideas and words should be your own!`;
        }
        
        if (lowerQuery.includes('science') || lowerQuery.includes('experiment') || lowerQuery.includes('hypothesis')) {
            return `For science questions, let's think about the scientific method:

1. What phenomenon are you trying to understand?
2. What do you already know about this topic?
3. What variables might be involved?
4. How could you test or investigate this?

I can help explain scientific concepts and guide your thinking process!`;
        }
        
        return `I'm here to help guide your learning! To give you the best hints and guidance:

1. Can you tell me more about what specific concept you're struggling with?
2. What have you tried so far?
3. What part is confusing you the most?

Remember, I'm designed to help you learn and think through problems rather than provide direct answers. This way, you'll truly understand the material!`;
    }
}

// Chat Interface Class
class ChatInterface {
    constructor() {
        this.aiService = new AIService();
        this.messages = [];
        this.isLoading = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.addInitialMessage();
    }

    initializeElements() {
        this.messagesContainer = document.getElementById('messagesContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.loadingMessage = document.getElementById('loadingMessage');
        this.configModal = document.getElementById('configModal');
        this.configButton = document.getElementById('configButton');
        this.closeModal = document.getElementById('closeModal');
        this.saveConfig = document.getElementById('saveConfig');
        this.n8nUrlInput = document.getElementById('n8nUrl');
        this.geminiKeyInput = document.getElementById('geminiKey');
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        // Configuration modal
        this.configButton.addEventListener('click', () => this.openConfigModal());
        this.closeModal.addEventListener('click', () => this.closeConfigModal());
        this.saveConfig.addEventListener('click', () => this.saveConfiguration());
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.configModal) {
                this.closeConfigModal();
            }
        });

        // Load saved configuration
        this.loadConfiguration();
    }

    addInitialMessage() {
        const timestamp = new Date().toLocaleTimeString();
        document.getElementById('initialTimestamp').textContent = timestamp;
    }

    async handleSendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isLoading) return;

        // Add user message
        this.addMessage('user', message);
        this.messageInput.value = '';
        this.setLoading(true);

        try {
            const response = await this.aiService.processStudentQuery(message);
            this.addMessage('assistant', response, true);
        } catch (error) {
            this.addMessage('assistant', "I'm sorry, I encountered an error while processing your request. Please try again.", true);
        } finally {
            this.setLoading(false);
        }
    }

    addMessage(type, content, isHint = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const timestamp = new Date().toLocaleTimeString();
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="avatar ${type}-avatar">
                    <i class="fas ${type === 'user' ? 'fa-user' : 'fa-robot'}"></i>
                </div>
                <div class="message-bubble ${type}-bubble">
                    ${isHint && type === 'assistant' ? `
                        <div class="hint-indicator">
                            <i class="fas fa-lightbulb"></i>
                            <span>Study Hint</span>
                        </div>
                    ` : ''}
                    <p>${content}</p>
                    <span class="timestamp">${timestamp}</span>
                </div>
            </div>
        `;

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    setLoading(loading) {
        this.isLoading = loading;
        this.sendButton.disabled = loading;
        this.messageInput.disabled = loading;
        this.loadingMessage.style.display = loading ? 'flex' : 'none';
        
        if (loading) {
            this.scrollToBottom();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    openConfigModal() {
        this.configModal.style.display = 'block';
    }

    closeConfigModal() {
        this.configModal.style.display = 'none';
    }

    loadConfiguration() {
        const n8nUrl = localStorage.getItem('n8nWebhookUrl') || '';
        const geminiKey = localStorage.getItem('geminiApiKey') || '';
        
        this.n8nUrlInput.value = n8nUrl;
        this.geminiKeyInput.value = geminiKey;
    }

    saveConfiguration() {
        const n8nUrl = this.n8nUrlInput.value.trim();
        const geminiKey = this.geminiKeyInput.value.trim();
        
        this.aiService.updateConfig(n8nUrl, geminiKey);
        this.closeConfigModal();
        
        // Show success message
        this.addMessage('assistant', 'Configuration saved successfully! You can now use the AI assistant with your settings.', true);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatInterface();
});