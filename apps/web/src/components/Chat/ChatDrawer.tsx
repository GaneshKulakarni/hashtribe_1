import { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/stores/chatStore';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';

export function ChatDrawer() {
    const { isOpen, closeDrawer, activeConversationId, conversations, setActiveConversation } = useChatStore();
    const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) closeDrawer();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeDrawer]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        onClick={closeDrawer} id="chat-drawer-backdrop"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-charcoal-950 border-l border-charcoal-800 z-[61] flex flex-col shadow-2xl"
                        id="chat-drawer-panel"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-charcoal-800 bg-black/80 backdrop-blur-sm">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-charcoal-700 to-charcoal-900 rounded-lg flex items-center justify-center border border-charcoal-700">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-sm font-bold text-white tracking-tight">Chat</h1>
                                    <p className="text-[10px] text-grey-500 font-mono">HashTribe Messenger</p>
                                </div>
                            </div>
                            <button onClick={closeDrawer} className="p-2 rounded-lg text-grey-400 hover:text-white hover:bg-charcoal-800 transition-colors" id="chat-drawer-close">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden">
                            <AnimatePresence mode="wait">
                                {activeConversation ? (
                                    <motion.div key="chat-window" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.2 }} className="h-full">
                                        <ChatWindow conversation={activeConversation} onBack={() => setActiveConversation(null)} />
                                    </motion.div>
                                ) : (
                                    <motion.div key="chat-sidebar" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.2 }} className="h-full">
                                        <ChatSidebar />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
