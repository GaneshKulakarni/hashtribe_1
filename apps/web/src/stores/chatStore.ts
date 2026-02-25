import { create } from 'zustand';

export interface ChatMessage {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    content: string;
    timestamp: Date;
    isOwn: boolean;
}

export interface Conversation {
    id: string;
    participantName: string;
    participantAvatar: string;
    participantUsername: string;
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
    isOnline: boolean;
}

interface ChatState {
    isOpen: boolean;
    activeConversationId: string | null;
    conversations: Conversation[];
    messages: Record<string, ChatMessage[]>;
    searchQuery: string;
    isLoading: boolean;

    // Actions
    toggleDrawer: () => void;
    openDrawer: () => void;
    closeDrawer: () => void;
    setActiveConversation: (id: string | null) => void;
    sendMessage: (conversationId: string, content: string) => void;
    setSearchQuery: (query: string) => void;
    getTotalUnreadCount: () => number;
}

// Mock conversations for demo
const mockConversations: Conversation[] = [
    {
        id: 'conv-1',
        participantName: 'Alex Chen',
        participantAvatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=6366f1&color=fff',
        participantUsername: 'alexchen',
        lastMessage: 'Hey! Did you check the latest PR?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
        unreadCount: 2,
        isOnline: true,
    },
    {
        id: 'conv-2',
        participantName: 'Sarah Kim',
        participantAvatar: 'https://ui-avatars.com/api/?name=Sarah+Kim&background=ec4899&color=fff',
        participantUsername: 'sarahkim',
        lastMessage: 'The hackathon starts tomorrow! 🚀',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
        unreadCount: 0,
        isOnline: true,
    },
    {
        id: 'conv-3',
        participantName: 'Mike Johnson',
        participantAvatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=10b981&color=fff',
        participantUsername: 'mikej',
        lastMessage: 'Can you review my code?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
        unreadCount: 1,
        isOnline: false,
    },
    {
        id: 'conv-4',
        participantName: 'Priya Patel',
        participantAvatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=f59e0b&color=fff',
        participantUsername: 'priyap',
        lastMessage: 'Great work on the feature!',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
        unreadCount: 0,
        isOnline: false,
    },
];

// Mock messages for demo
const mockMessages: Record<string, ChatMessage[]> = {
    'conv-1': [
        {
            id: 'msg-1',
            conversationId: 'conv-1',
            senderId: 'alex',
            senderName: 'Alex Chen',
            senderAvatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=6366f1&color=fff',
            content: 'Hey, have you seen the new tribe feature?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            isOwn: false,
        },
        {
            id: 'msg-2',
            conversationId: 'conv-1',
            senderId: 'me',
            senderName: 'You',
            senderAvatar: '',
            content: 'Yes! It looks amazing. Great work!',
            timestamp: new Date(Date.now() - 1000 * 60 * 45),
            isOwn: true,
        },
        {
            id: 'msg-3',
            conversationId: 'conv-1',
            senderId: 'alex',
            senderName: 'Alex Chen',
            senderAvatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=6366f1&color=fff',
            content: 'Thanks! I also pushed some fixes to the auth flow.',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            isOwn: false,
        },
        {
            id: 'msg-4',
            conversationId: 'conv-1',
            senderId: 'alex',
            senderName: 'Alex Chen',
            senderAvatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=6366f1&color=fff',
            content: 'Hey! Did you check the latest PR?',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            isOwn: false,
        },
    ],
    'conv-2': [
        {
            id: 'msg-5',
            conversationId: 'conv-2',
            senderId: 'sarah',
            senderName: 'Sarah Kim',
            senderAvatar: 'https://ui-avatars.com/api/?name=Sarah+Kim&background=ec4899&color=fff',
            content: 'Are you joining the hackathon?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            isOwn: false,
        },
        {
            id: 'msg-6',
            conversationId: 'conv-2',
            senderId: 'me',
            senderName: 'You',
            senderAvatar: '',
            content: 'Absolutely! Already registered.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            isOwn: true,
        },
        {
            id: 'msg-7',
            conversationId: 'conv-2',
            senderId: 'sarah',
            senderName: 'Sarah Kim',
            senderAvatar: 'https://ui-avatars.com/api/?name=Sarah+Kim&background=ec4899&color=fff',
            content: 'The hackathon starts tomorrow! 🚀',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            isOwn: false,
        },
    ],
    'conv-3': [
        {
            id: 'msg-8',
            conversationId: 'conv-3',
            senderId: 'mike',
            senderName: 'Mike Johnson',
            senderAvatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=10b981&color=fff',
            content: 'Can you review my code?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            isOwn: false,
        },
    ],
    'conv-4': [
        {
            id: 'msg-9',
            conversationId: 'conv-4',
            senderId: 'me',
            senderName: 'You',
            senderAvatar: '',
            content: 'Just deployed the new update!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
            isOwn: true,
        },
        {
            id: 'msg-10',
            conversationId: 'conv-4',
            senderId: 'priya',
            senderName: 'Priya Patel',
            senderAvatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=f59e0b&color=fff',
            content: 'Great work on the feature!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
            isOwn: false,
        },
    ],
};

export const useChatStore = create<ChatState>((set, get) => ({
    isOpen: false,
    activeConversationId: null,
    conversations: mockConversations,
    messages: mockMessages,
    searchQuery: '',
    isLoading: false,

    toggleDrawer: () => set(state => ({ isOpen: !state.isOpen })),
    openDrawer: () => set({ isOpen: true }),
    closeDrawer: () => set({ isOpen: false, activeConversationId: null }),

    setActiveConversation: (id) => {
        set({ activeConversationId: id });
        // Clear unread count for this conversation
        if (id) {
            set(state => ({
                conversations: state.conversations.map(c =>
                    c.id === id ? { ...c, unreadCount: 0 } : c
                ),
            }));
        }
    },

    sendMessage: (conversationId, content) => {
        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            conversationId,
            senderId: 'me',
            senderName: 'You',
            senderAvatar: '',
            content,
            timestamp: new Date(),
            isOwn: true,
        };

        set(state => ({
            messages: {
                ...state.messages,
                [conversationId]: [
                    ...(state.messages[conversationId] || []),
                    newMessage,
                ],
            },
            conversations: state.conversations.map(c =>
                c.id === conversationId
                    ? { ...c, lastMessage: content, lastMessageTime: new Date() }
                    : c
            ),
        }));

        // Simulate a reply after a short delay
        setTimeout(() => {
            const conv = get().conversations.find(c => c.id === conversationId);
            if (!conv) return;

            const replies = [
                'Sounds good! 👍',
                'Let me check on that.',
                'I\'ll get back to you soon!',
                'That\'s a great idea!',
                'Sure, let\'s do it.',
                'Thanks for the update! 🙏',
            ];

            const autoReply: ChatMessage = {
                id: `msg-${Date.now()}-reply`,
                conversationId,
                senderId: conv.id,
                senderName: conv.participantName,
                senderAvatar: conv.participantAvatar,
                content: replies[Math.floor(Math.random() * replies.length)],
                timestamp: new Date(),
                isOwn: false,
            };

            set(state => ({
                messages: {
                    ...state.messages,
                    [conversationId]: [
                        ...(state.messages[conversationId] || []),
                        autoReply,
                    ],
                },
                conversations: state.conversations.map(c =>
                    c.id === conversationId
                        ? {
                            ...c,
                            lastMessage: autoReply.content,
                            lastMessageTime: new Date(),
                            unreadCount: state.activeConversationId === conversationId ? 0 : c.unreadCount + 1,
                        }
                        : c
                ),
            }));
        }, 1500 + Math.random() * 2000);
    },

    setSearchQuery: (query) => set({ searchQuery: query }),

    getTotalUnreadCount: () => {
        return get().conversations.reduce((total, c) => total + c.unreadCount, 0);
    },
}));
