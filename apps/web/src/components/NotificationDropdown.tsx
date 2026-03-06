import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, AtSign, Users, UserPlus, CheckCheck, Bell, X, ChevronRight } from 'lucide-react';
import { useNotificationStore, type Notification, type NotificationType } from '@/stores/notificationStore';

// ─── Helpers ────────────────────────────────────────────────────────────────

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

const typeAction: Record<NotificationType, string> = {
    like: 'liked your post',
    comment: 'commented on your post',
    mention: 'mentioned you in a post',
    tribe_invite: 'sent you a tribe invite',
    follow: 'started following you',
};

// ─── Grouping Logic ──────────────────────────────────────────────────────────

interface NotificationGroup {
    ids: string[];
    type: NotificationType;
    actors: { name: string; avatar: string }[];
    representative: Notification;
    isRead: boolean;
}

// Only 'like' and 'follow' are grouped (comments/mentions are individual)
const GROUPABLE: NotificationType[] = ['like', 'follow'];

function groupNotifications(notifications: Notification[]): NotificationGroup[] {
    const groups = new Map<string, NotificationGroup>();

    for (const n of notifications) {
        const groupKey = GROUPABLE.includes(n.type) ? `${n.type}::${n.href}` : n.id;
        const existing = groups.get(groupKey);
        if (existing) {
            existing.actors.push({ name: n.actorName, avatar: n.actorAvatar });
            existing.ids.push(n.id);
            if (!n.isRead) existing.isRead = false;
        } else {
            groups.set(groupKey, {
                ids: [n.id],
                type: n.type,
                actors: [{ name: n.actorName, avatar: n.actorAvatar }],
                representative: n,
                isRead: n.isRead,
            });
        }
    }

    return Array.from(groups.values());
}

function getGroupLabel(group: NotificationGroup): string {
    const { actors, type } = group;
    const action = typeAction[type];
    if (actors.length === 1) return action;
    if (actors.length === 2) return `and ${actors[1].name} ${action}`;
    return `and ${actors.length - 1} others ${action}`;
}

// ─── Notification Row ────────────────────────────────────────────────────────

function NotificationRow({ group }: { group: NotificationGroup }) {
    const { markAsRead, dismiss, closeDropdown } = useNotificationStore();
    const navigate = useNavigate();

    const handleClick = () => {
        markAsRead(group.ids);
        closeDropdown();
        navigate(group.representative.href);
    };

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        dismiss(group.ids);
    };

    const showOverlap = group.actors.length > 1;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
            transition={{ duration: 0.18 }}
            className={`relative group/row flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer hover:bg-grey-50 dark:hover:bg-charcoal-800/60 ${!group.isRead ? 'bg-grey-50/70 dark:bg-charcoal-800/30' : ''
                }`}
            onClick={handleClick}
        >
            {/* Avatar stack */}
            <div className="relative flex-shrink-0 mt-0.5" style={{ width: showOverlap ? 44 : 36 }}>
                {showOverlap && (
                    <img
                        src={group.actors[1]?.avatar}
                        alt=""
                        className="absolute left-4 top-0 w-9 h-9 rounded-full object-cover border-2 border-white dark:border-charcoal-900"
                    />
                )}
                <img
                    src={group.actors[0].avatar}
                    alt={group.actors[0].name}
                    className="relative z-10 w-9 h-9 rounded-full object-cover border-2 border-white dark:border-charcoal-900"
                />
                <span className="absolute -bottom-0.5 -right-0.5 z-20 w-5 h-5 rounded-full bg-white dark:bg-charcoal-900 border border-grey-200 dark:border-charcoal-700 flex items-center justify-center">
                    {typeIcon[group.type]}
                </span>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 pr-6">
                <p className="text-sm text-charcoal-900 dark:text-grey-100 leading-snug">
                    <span className="font-semibold">{group.actors[0].name}</span>{' '}
                    <span className="text-grey-600 dark:text-grey-400">{getGroupLabel(group)}</span>
                </p>
                <p className="text-[11px] text-grey-400 dark:text-grey-500 mt-0.5 font-mono">
                    {timeAgo(group.representative.createdAt)}
                </p>
            </div>

            {/* Unread dot */}
            {!group.isRead && (
                <div className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-charcoal-900 dark:bg-white" />
            )}

            {/* Dismiss button — visible on hover */}
            <button
                onClick={handleDismiss}
                title="Dismiss"
                className="absolute top-2 right-2 p-1 rounded-md text-grey-400 hover:text-charcoal-900 dark:hover:text-white hover:bg-grey-200 dark:hover:bg-charcoal-700 opacity-0 group-hover/row:opacity-100 transition-all"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </motion.div>
    );
}

// ─── Main Dropdown ───────────────────────────────────────────────────────────

export function NotificationDropdown() {
    const { isOpen, notifications, closeDropdown, markAllAsRead } = useNotificationStore();
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const grouped = groupNotifications(notifications);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handle = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                closeDropdown();
            }
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, [isOpen, closeDropdown]);

    useEffect(() => {
        if (!isOpen) return;
        const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDropdown(); };
        document.addEventListener('keydown', handle);
        return () => document.removeEventListener('keydown', handle);
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
                    className="absolute right-0 top-full mt-2 w-[380px] rounded-xl bg-white dark:bg-charcoal-900 border border-grey-200 dark:border-charcoal-800 shadow-xl z-50 overflow-hidden"
                    id="notification-dropdown"
                >
                    {/* Header */}
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

                    {/* Notification list */}
                    <div className="max-h-[400px] overflow-y-auto divide-y divide-grey-100 dark:divide-charcoal-800/60">
                        {grouped.length === 0 ? (
                            <div className="py-12 text-center">
                                <Bell className="w-8 h-8 text-grey-300 dark:text-grey-600 mx-auto mb-2" />
                                <p className="text-sm text-grey-500 dark:text-grey-400 font-medium">You're all caught up!</p>
                                <p className="text-xs text-grey-400 dark:text-grey-500 mt-1">No new notifications</p>
                            </div>
                        ) : (
                            <AnimatePresence initial={false}>
                                {grouped.map((g) => (
                                    <NotificationRow key={g.ids[0]} group={g} />
                                ))}
                            </AnimatePresence>
                        )}
                    </div>

                    {/* Footer — "View all" link */}
                    {grouped.length > 0 && (
                        <div className="border-t border-grey-200 dark:border-charcoal-800 bg-grey-50 dark:bg-charcoal-950/50">
                            <Link
                                to="/notifications"
                                onClick={closeDropdown}
                                className="flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-grey-500 dark:text-grey-400 hover:text-charcoal-900 dark:hover:text-white transition-colors"
                            >
                                View all notifications
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
