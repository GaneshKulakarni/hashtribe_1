import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, AtSign, Users, UserPlus, CheckCheck, Bell } from 'lucide-react';
import { useNotificationStore, type Notification, type NotificationType } from '@/stores/notificationStore';

function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

const typeIcon: Record<NotificationType, JSX.Element> = {
    like: <Heart className="w-3.5 h-3.5 text-red-400" />,
    comment: <MessageCircle className="w-3.5 h-3.5 text-blue-400" />,
    mention: <AtSign className="w-3.5 h-3.5 text-purple-400" />,
    tribe_invite: <Users className="w-3.5 h-3.5 text-amber-400" />,
    follow: <UserPlus className="w-3.5 h-3.5 text-green-400" />,
};

function NotificationItem({ notification }: { notification: Notification }) {
    const { markAsRead, closeDropdown } = useNotificationStore();
    const navigate = useNavigate();

    const handleClick = () => {
        markAsRead(notification.id);
        closeDropdown();
        navigate(notification.href);
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-grey-50 dark:hover:bg-charcoal-800/60 ${!notification.isRead ? 'bg-grey-50/70 dark:bg-charcoal-800/30' : ''
                }`}
        >
            <div className="relative flex-shrink-0 mt-0.5">
                <img
                    src={notification.actorAvatar}
                    alt={notification.actorName}
                    className="w-9 h-9 rounded-full object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white dark:bg-charcoal-900 border border-grey-200 dark:border-charcoal-700 flex items-center justify-center">
                    {typeIcon[notification.type]}
                </span>
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm text-charcoal-900 dark:text-grey-100 leading-snug">
                    <span className="font-semibold">{notification.actorName}</span>{' '}
                    <span className="text-grey-600 dark:text-grey-400">{notification.message}</span>
                </p>
                <p className="text-[11px] text-grey-400 dark:text-grey-500 mt-0.5 font-mono">
                    {timeAgo(notification.createdAt)}
                </p>
            </div>

            {!notification.isRead && (
                <div className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-charcoal-900 dark:bg-white" />
            )}
        </button>
    );
}

export function NotificationDropdown() {
    const { isOpen, notifications, closeDropdown, markAllAsRead } = useNotificationStore();
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                closeDropdown();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, closeDropdown]);

    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeDropdown();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeDropdown]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-[360px] rounded-xl bg-white dark:bg-charcoal-900 border border-grey-200 dark:border-charcoal-800 shadow-xl z-50 overflow-hidden"
                    id="notification-dropdown"
                >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-grey-200 dark:border-charcoal-800 bg-grey-50 dark:bg-charcoal-950/50">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-charcoal-900 dark:text-white" />
                            <span className="text-sm font-bold text-charcoal-900 dark:text-white">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="min-w-[20px] h-5 px-1 bg-charcoal-900 dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-1 text-[11px] text-grey-500 dark:text-grey-400 hover:text-charcoal-900 dark:hover:text-white transition-colors font-medium"
                                title="Mark all as read"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto divide-y divide-grey-100 dark:divide-charcoal-800/60">
                        {notifications.length === 0 ? (
                            <div className="py-12 text-center">
                                <Bell className="w-8 h-8 text-grey-300 dark:text-grey-600 mx-auto mb-2" />
                                <p className="text-sm text-grey-400 dark:text-grey-500">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((n) => <NotificationItem key={n.id} notification={n} />)
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
