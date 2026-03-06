import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useChatStore } from '@/stores/chatStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { Bell, Search, Plus, MessageSquare, UserCircle, LogOut, Settings } from 'lucide-react';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { ChatDrawer } from '@/components/Chat';
import { ThemeToggle } from '@/components/ThemeToggle';

import logoDark from './assets/logo_dark_croped.png';
import logoLight from './assets/logo_light.png';

export function Header() {
    const { user, profile, signOut } = useAuthStore();
    const { theme } = useThemeStore();
    const navigate = useNavigate();
    const { toggleDrawer } = useChatStore();
    const unreadChatCount = useChatStore(state => state.conversations.reduce((total, c) => total + c.unreadCount, 0));

    const { toggleDropdown, notifications } = useNotificationStore();
    const unreadNotifCount = notifications.filter(n => !n.isRead).length;

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const isDark = theme === 'dark';

    return (
        <>
            <header className="fixed top-0 left-0 right-0 h-16 z-50 px-4 flex items-center justify-between border-b bg-white/85 backdrop-blur-xl border-grey-200 dark:bg-black dark:border-charcoal-800">
                {/* Logo */}
                <div className="flex items-center w-64">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="h-8 w-8 flex-shrink-0">
                            <img
                                src={isDark ? logoDark : logoLight}
                                alt=""
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <span className="text-xl font-bold tracking-tight hidden md:block text-charcoal-900 dark:text-white">
                            HashTribe
                        </span>
                    </Link>
                </div>

                {/* Center Search */}
                <div className="flex-1 max-w-2xl px-8 hidden md:block">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-grey-400 dark:text-grey-500 group-focus-within:text-charcoal-900 dark:group-focus-within:text-white transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-4 py-2 bg-grey-100 dark:bg-charcoal-900 border border-grey-300 dark:border-charcoal-700 rounded-xl text-charcoal-900 dark:text-white placeholder-grey-500 dark:placeholder-grey-600 focus:outline-none focus:border-charcoal-400 dark:focus:border-white/50 focus:ring-1 focus:ring-charcoal-400 dark:focus:ring-white/50 transition-all font-mono text-sm"
                            placeholder="Search tribes, challenges, or users..."
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-2 md:space-x-3">
                    {user ? (
                        <>
                            {/* Create Button */}
                            <Link
                                to="/tribes/create"
                                className="p-2 rounded-lg bg-charcoal-900/10 dark:bg-white/10 text-charcoal-900 dark:text-white hover:bg-charcoal-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 group"
                                title="Create New Tribe"
                            >
                                <Plus className="w-5 h-5" />
                            </Link>

                            {/* Theme Toggle */}
                            <ThemeToggle />

                            {/* Messages / Chat Toggle */}
                            <button
                                onClick={toggleDrawer}
                                className="p-2 rounded-lg text-grey-500 dark:text-grey-400 hover:text-charcoal-900 dark:hover:text-white hover:bg-grey-200 dark:hover:bg-charcoal-800 transition-colors relative"
                                title="Messages"
                                id="chat-toggle-button"
                            >
                                <MessageSquare className="w-5 h-5" />
                                {unreadChatCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-charcoal-900 dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-black">
                                        {unreadChatCount > 9 ? '9+' : unreadChatCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="p-2 rounded-lg text-grey-500 dark:text-grey-400 hover:text-charcoal-900 dark:hover:text-white hover:bg-grey-200 dark:hover:bg-charcoal-800 transition-colors relative"
                                    title="Notifications"
                                    id="notification-bell-button"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadNotifCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
                                            <span className="relative min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-black">
                                                {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                                            </span>
                                        </span>
                                    )}
                                </button>
                                <NotificationDropdown />
                            </div>

                            {/* User Profile */}
                            <div className="relative group ml-2">
                                <div className="flex items-center space-x-2 cursor-pointer py-1">
                                    <img
                                        src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${user.email || 'U'}&background=random`}
                                        alt={profile?.username || 'User'}
                                        className="w-9 h-9 rounded-full border border-grey-300 dark:border-charcoal-700 group-hover:border-charcoal-900 dark:group-hover:border-white transition-colors object-cover"
                                    />
                                </div>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-white dark:bg-charcoal-900 border border-grey-200 dark:border-charcoal-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-grey-200 dark:border-charcoal-800 bg-grey-50 dark:bg-charcoal-950/50">
                                        <p className="text-charcoal-900 dark:text-white font-bold text-sm truncate">
                                            {profile?.display_name || user.email?.split('@')[0]}
                                        </p>
                                        <p className="text-grey-500 text-xs truncate">{user.email}</p>
                                    </div>
                                    <div className="py-1">
                                        <Link to={`/profile/${profile?.username}`} className="flex items-center space-x-2 px-4 py-2.5 text-sm text-grey-600 dark:text-grey-200 hover:bg-grey-100 dark:hover:bg-charcoal-800 hover:text-charcoal-900 dark:hover:text-white transition-colors">
                                            <UserCircle className="w-4 h-4" />
                                            <span>Profile</span>
                                        </Link>
                                        <Link to="/settings" className="flex items-center space-x-2 px-4 py-2.5 text-sm text-grey-600 dark:text-grey-200 hover:bg-grey-100 dark:hover:bg-charcoal-800 hover:text-charcoal-900 dark:hover:text-white transition-colors">
                                            <Settings className="w-4 h-4" />
                                            <span>Settings</span>
                                        </Link>
                                        <div className="border-t border-grey-200 dark:border-charcoal-800 my-1"></div>
                                        <button onClick={handleSignOut} className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-colors text-left">
                                            <LogOut className="w-4 h-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Theme Toggle for non-logged-in users too */}
                            <ThemeToggle />
                            <Link to="/login" className="px-5 py-2 bg-charcoal-900 dark:bg-white text-white dark:text-black text-sm font-bold rounded-lg hover:bg-charcoal-800 dark:hover:bg-grey-200 transition-colors">
                                Sign In
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* Chat Drawer */}
            <ChatDrawer />
        </>
    );
}
