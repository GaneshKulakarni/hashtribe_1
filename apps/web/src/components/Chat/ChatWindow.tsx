import { useEffect, useRef } from 'react';
import { ArrowLeft, Phone, Video, MoreVertical, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore, type Conversation, type ChatMessage } from '@/stores/chatStore';
import { MessageInput } from './MessageInput';

function formatMessageTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ message, showAvatar }: { message: ChatMessage; showAvatar: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`flex items-end space-x-2 ${message.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}
        >
            {!message.isOwn && showAvatar ? (
                <img src={message.senderAvatar} alt={message.senderName} className="w-6 h-6 rounded-full flex-shrink-0 mb-1" />
            ) : !message.isOwn ? (
                <div className="w-6 flex-shrink-0" />
            ) : null}

            <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${message.isOwn ? 'bg-white text-black rounded-br-md' : 'bg-charcoal-800 text-grey-100 rounded-bl-md'
                }`}>
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <p className="text-[10px] mt-1 text-grey-500">{formatMessageTime(message.timestamp)}</p>
            </div>
        </motion.div>
    );
}

function TypingIndicator() {
    return (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="flex items-end space-x-2">
            <div className="w-6" />
            <div className="bg-charcoal-800 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex space-x-1">
                    {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 bg-grey-500 rounded-full"
                            animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

interface ChatWindowProps {
    conversation: Conversation;
    onBack: () => void;
}

export function ChatWindow({ conversation, onBack }: ChatWindowProps) {
    const { messages, sendMessage } = useChatStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const conversationMessages = messages[conversation.id] || [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversationMessages.length]);

    const shouldShowAvatar = (index: number): boolean => {
        if (index === conversationMessages.length - 1) return true;
        return conversationMessages[index].senderId !== conversationMessages[index + 1].senderId;
    };

    return (
        <div className="flex flex-col h-full" id="chat-window">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-charcoal-800 bg-charcoal-900/50 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                    <button onClick={onBack} className="p-1.5 rounded-lg text-grey-400 hover:text-white hover:bg-charcoal-800 transition-colors" id="chat-back-button">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="relative">
                        <img src={conversation.participantAvatar} alt={conversation.participantName} className="w-9 h-9 rounded-full border border-charcoal-700" />
                        {conversation.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-charcoal-900" />}
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">{conversation.participantName}</h3>
                        <p className="text-[11px] text-grey-500 font-mono">
                            {conversation.isOnline ? <span className="text-green-400">Online</span> : 'Offline'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    <button className="p-2 rounded-lg text-grey-500 hover:text-white hover:bg-charcoal-800 transition-colors" title="Voice call (coming soon)"><Phone className="w-4 h-4" /></button>
                    <button className="p-2 rounded-lg text-grey-500 hover:text-white hover:bg-charcoal-800 transition-colors" title="Video call (coming soon)"><Video className="w-4 h-4" /></button>
                    <button className="p-2 rounded-lg text-grey-500 hover:text-white hover:bg-charcoal-800 transition-colors" title="More options"><MoreVertical className="w-4 h-4" /></button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scroll-smooth" id="chat-messages-container">
                <div className="flex items-center justify-center py-4 mb-2">
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-charcoal-800/50 rounded-full">
                        <Shield className="w-3 h-3 text-grey-500" />
                        <p className="text-[10px] text-grey-500 font-mono">Messages are end-to-end encrypted</p>
                    </div>
                </div>
                <AnimatePresence>
                    {conversationMessages.map((msg, index) => (
                        <MessageBubble key={msg.id} message={msg} showAvatar={shouldShowAvatar(index)} />
                    ))}
                </AnimatePresence>
                <AnimatePresence>
                    {conversationMessages.length > 0 && conversationMessages[conversationMessages.length - 1]?.isOwn && <TypingIndicator />}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            <MessageInput onSend={(content) => sendMessage(conversation.id, content)} />
        </div>
    );
}
