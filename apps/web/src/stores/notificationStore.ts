import { create } from 'zustand';

export type NotificationType = 'like' | 'comment' | 'mention' | 'tribe_invite' | 'follow';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    actorName: string;
    actorAvatar: string;
    href: string;
    isRead: boolean;
    createdAt: Date;
}

interface NotificationState {
    isOpen: boolean;
    notifications: Notification[];

    toggleDropdown: () => void;
    closeDropdown: () => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
}

const mockNotifications: Notification[] = [
    {
        id: 'n-1',
        type: 'like',
        message: 'liked your post',
        actorName: 'Alex Chen',
        actorAvatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=6366f1&color=fff',
        href: '/feed',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
        id: 'n-2',
        type: 'comment',
        message: 'commented on your post: "Great work on this!"',
        actorName: 'Sarah Kim',
        actorAvatar: 'https://ui-avatars.com/api/?name=Sarah+Kim&background=ec4899&color=fff',
        href: '/feed',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
        id: 'n-3',
        type: 'mention',
        message: 'mentioned you in a post',
        actorName: 'Mike Johnson',
        actorAvatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=10b981&color=fff',
        href: '/feed',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
        id: 'n-4',
        type: 'tribe_invite',
        message: 'invited you to join the tribe "React Wizards"',
        actorName: 'Priya Patel',
        actorAvatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=f59e0b&color=fff',
        href: '/tribes',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
        id: 'n-5',
        type: 'follow',
        message: 'started following you',
        actorName: 'David Lee',
        actorAvatar: 'https://ui-avatars.com/api/?name=David+Lee&background=8b5cf6&color=fff',
        href: '/feed',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
];

export const useNotificationStore = create<NotificationState>((set) => ({
    isOpen: false,
    notifications: mockNotifications,

    toggleDropdown: () => set((state) => ({ isOpen: !state.isOpen })),
    closeDropdown: () => set({ isOpen: false }),

    markAsRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, isRead: true } : n
            ),
        })),

    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),
}));
