import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaStethoscope, FaUserMd, FaPaperPlane, FaSpinner } from 'react-icons/fa';

const DeepSeekChat = ({ apiKey }) => {
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your Medical AI Assistant. I can help with diagnoses, treatments, and general medical information. How can I assist you today?", 
      sender: 'ai' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        {
          messages: [
            {
              role: 'system',
              content: 'You are a helpful medical AI assistant. Provide accurate, evidence-based medical information. Be clear and concise. For serious symptoms, always recommend consulting a healthcare professional.'
            },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            { role: 'user', content: inputMessage }
          ],
          model: 'deepseek-chat',
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          timeout: 15000
        }
      );

      const aiMessage = { 
        text: response.data.choices[0]?.message?.content || "I didn't get a response. Please try again.", 
        sender: 'ai' 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.error?.message || 'Failed to get response. Please check your connection and try again.');
      // Add error message to chat
      const errorMessage = { 
        text: "I'm having trouble connecting. Please try again later or check your internet connection.", 
        sender: 'ai' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="medical-chat-container">
      <div className="chat-header">
        <FaUserMd className="text-xl mr-3" />
        <h2>Medical AI</h2>
        <button 
          onClick={() => setShowChat(false)}
          className="chat-close-button"
          aria-label="Close chat"
        >
          &times;
        </button>
      </div>
      
      <div className="chat-content">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.sender}`}
          >
            <div className={`message-content ${message.sender}`}>
              {message.sender === 'ai' && (
                <div className="ai-message-header">
                  <FaStethoscope className="mr-2" />
                  <span className="font-semibold">Medical AI:</span>
                </div>
              )}
              {message.text.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-2">{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message ai">
            <div className="message-content ai">
              <div className="flex items-center">
                <FaSpinner className="animate-spin mr-2" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-container">
        <div className="relative">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your medical question..."
            className="chat-textarea"
            rows={2}
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="chat-send-button"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </div>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeepSeekChat;