import { Search, MessageSquarePlus, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChatStore, type Conversation } from '@/stores/chatStore';

function formatTimestamp(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

interface ConversationItemProps {
    conversation: Conversation;
    isActive: boolean;
    onClick: () => void;
    index: number;
}

function ConversationItem({ conversation, isActive, onClick, index }: ConversationItemProps) {
    return (
        <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            onClick={onClick}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 text-left group ${isActive
                    ? 'bg-charcoal-800 border border-charcoal-700'
                    : 'hover:bg-charcoal-800/50 border border-transparent'
                }`}
            id={`chat-conversation-${conversation.id}`}
        >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <img
                    src={conversation.participantAvatar}
                    alt={conversation.participantName}
                    className={`w-11 h-11 rounded-full border-2 transition-colors ${isActive ? 'border-white/30' : 'border-charcoal-700 group-hover:border-charcoal-600'
                        }`}
                />
                {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-charcoal-900" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium truncate ${conversation.unreadCount > 0 ? 'text-white font-semibold' : 'text-grey-200'
                        }`}>
                        {conversation.participantName}
                    </h4>
                    <span className={`text-[10px] flex-shrink-0 ml-2 font-mono ${conversation.unreadCount > 0 ? 'text-white' : 'text-grey-600'
                        }`}>
                        {formatTimestamp(conversation.lastMessageTime)}
                    </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                    <p className={`text-xs truncate ${conversation.unreadCount > 0 ? 'text-grey-300' : 'text-grey-500'
                        }`}>
                        {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                        <span className="ml-2 flex-shrink-0 w-5 h-5 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                            {conversation.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </motion.button>
    );
}

function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full px-6 py-12"
        >
            <div className="w-16 h-16 bg-charcoal-800 rounded-2xl flex items-center justify-center mb-4 border border-charcoal-700">
                <Users className="w-8 h-8 text-grey-500" />
            </div>
            <h3 className="text-white font-semibold mb-1">No conversations yet</h3>
            <p className="text-grey-500 text-sm text-center">
                Start a conversation by messaging someone from their profile.
            </p>
        </motion.div>
    );
}

export function ChatSidebar() {
    const { conversations, searchQuery, setSearchQuery, activeConversationId, setActiveConversation } = useChatStore();

    const filteredConversations = conversations.filter(c =>
        c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full" id="chat-sidebar">
            {/* Header */}
            <div className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-white tracking-tight">Messages</h2>
                    <button
                        className="p-2 rounded-lg text-grey-400 hover:text-white hover:bg-charcoal-800 transition-colors"
                        title="New conversation"
                        id="chat-new-conversation-button"
                    >
                        <MessageSquarePlus className="w-4 h-4" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-3.5 w-3.5 text-grey-500 group-focus-within:text-grey-300 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 bg-charcoal-900 border border-charcoal-700 rounded-xl text-white text-xs placeholder-grey-600 focus:outline-none focus:border-grey-500 focus:ring-1 focus:ring-grey-500/30 transition-all font-mono"
                        placeholder="Search conversations..."
                        id="chat-search-input"
                    />
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
                {filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation, index) => (
                        <ConversationItem
                            key={conversation.id}
                            conversation={conversation}
                            isActive={activeConversationId === conversation.id}
                            onClick={() => setActiveConversation(conversation.id)}
                            index={index}
                        />
                    ))
                ) : searchQuery ? (
                    <div className="text-center py-8 px-4">
                        <p className="text-grey-500 text-sm">No results for "{searchQuery}"</p>
                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>

            {/* Online Users Count */}
            <div className="px-4 py-3 border-t border-charcoal-800">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-[11px] text-grey-500 font-mono">
                        {conversations.filter(c => c.isOnline).length} online
                    </p>
                </div>
            </div>
        </div>
    );
}
