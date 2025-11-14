
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslations } from '../../hooks/useTranslations';
import { SparklesIcon } from '../icons';
import Modal from './Modal';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const Assistant: React.FC = () => {
    const { getAssistantResponse } = useAppContext();
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!userInput.trim()) return;

        const newMessages: Message[] = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        const aiResponse = await getAssistantResponse(userInput);
        
        setMessages([...newMessages, { sender: 'ai', text: aiResponse }]);
        setIsLoading(false);
    };

    const handleOpen = () => {
        setMessages([]);
        setIsOpen(true);
    }
    
    return (
        <>
            <button
                onClick={handleOpen}
                className="fixed bottom-6 end-6 bg-accent text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform z-30"
                aria-label={t('aiAssistant')}
            >
                <SparklesIcon className="w-8 h-8" />
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('aiAssistant')}>
                <div className="flex flex-col h-[60vh]">
                    <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg bg-gray-200 text-gray-800 animate-pulse">
                                    ...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="mt-4 flex space-x-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                            placeholder={t('askAQuestion')}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading} className="bg-primary text-white font-bold py-3 px-6 rounded-lg transition duration-300 hover:bg-blue-800 disabled:bg-gray-400">
                            {'>'}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Assistant;
