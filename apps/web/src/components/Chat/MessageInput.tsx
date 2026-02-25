import { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        const trimmed = message.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setMessage('');
        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [message]);

    const canSend = message.trim().length > 0 && !disabled;

    return (
        <div className="p-3 border-t border-charcoal-800 bg-black/60 backdrop-blur-sm" id="chat-message-input">
            <div className="flex items-end space-x-2">
                {/* Attachment Button */}
                <button
                    className="p-2 rounded-lg text-grey-500 hover:text-grey-300 hover:bg-charcoal-800 transition-colors flex-shrink-0 mb-0.5"
                    title="Attach file (coming soon)"
                    id="chat-attach-button"
                >
                    <Paperclip className="w-4 h-4" />
                </button>

                {/* Input Field */}
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        disabled={disabled}
                        rows={1}
                        className="w-full px-4 py-2.5 bg-charcoal-900 border border-charcoal-700 rounded-xl text-white text-sm placeholder-grey-500 focus:outline-none focus:border-grey-500 focus:ring-1 focus:ring-grey-500/30 transition-all resize-none overflow-y-auto"
                        style={{ maxHeight: '120px' }}
                        id="chat-message-textarea"
                    />
                </div>

                {/* Emoji Button */}
                <button
                    className="p-2 rounded-lg text-grey-500 hover:text-grey-300 hover:bg-charcoal-800 transition-colors flex-shrink-0 mb-0.5"
                    title="Emoji (coming soon)"
                    id="chat-emoji-button"
                >
                    <Smile className="w-4 h-4" />
                </button>

                {/* Send Button */}
                <AnimatePresence mode="wait">
                    <motion.button
                        key={canSend ? 'active' : 'inactive'}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={handleSend}
                        disabled={!canSend}
                        className={`p-2.5 rounded-xl flex-shrink-0 mb-0.5 transition-all duration-200 ${canSend
                                ? 'bg-white text-black hover:bg-grey-200 shadow-glow-sm cursor-pointer'
                                : 'bg-charcoal-800 text-grey-600 cursor-not-allowed'
                            }`}
                        title="Send message"
                        id="chat-send-button"
                    >
                        <Send className="w-4 h-4" />
                    </motion.button>
                </AnimatePresence>
            </div>

            {/* Typing hint */}
            <p className="text-[10px] text-grey-600 mt-1.5 ml-12">
                Press <kbd className="px-1 py-0.5 bg-charcoal-800 rounded text-grey-500 font-mono text-[10px]">Enter</kbd> to send · <kbd className="px-1 py-0.5 bg-charcoal-800 rounded text-grey-500 font-mono text-[10px]">Shift+Enter</kbd> for new line
            </p>
        </div>
    );
}
