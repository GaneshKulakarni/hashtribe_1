import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { Bell, Search, LogOut, Trophy, Compass, LayoutGrid, Settings, UserCircle, Users } from 'lucide-react';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

import logoDark from '@/components/assets/logo_dark_croped.png';
import logoLight from '@/components/assets/logo_light.png';

// Reusable NavLink Component
interface NavLinkProps {
    to: string;
    children: ReactNode;
    icon?: ReactNode;
}

function NavLink({ to, children, icon }: NavLinkProps) {
    const location = useLocation();
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

    return (
        <Link
            to={to}
            className={clsx(
                'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                    ? 'bg-grey-200 dark:bg-charcoal-800 text-charcoal-900 dark:text-white'
                    : 'text-grey-500 dark:text-grey-400 hover:text-charcoal-900 dark:hover:text-white hover:bg-grey-100 dark:hover:bg-charcoal-900'
            )}
        >
            {icon && <span className={clsx(isActive ? 'text-charcoal-900 dark:text-white' : 'text-grey-500 dark:text-grey-500 group-hover:text-charcoal-900 dark:group-hover:text-white')}>{icon}</span>}
            <span>{children}</span>
        </Link>
    );
}

// Reusable IconButton Component
interface IconButtonProps {
    onClick?: () => void;
    children: ReactNode;
    className?: string;
}

function IconButton({ onClick, children, className }: IconButtonProps) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                'p-2 rounded-lg text-grey-500 dark:text-grey-400 hover:text-charcoal-900 dark:hover:text-white hover:bg-grey-100 dark:hover:bg-charcoal-800 transition-colors',
                className
            )}
        >
            {children}
        </button>
    );
}

export function Navbar() {
    const { user, profile, signOut } = useAuthStore();
    const { theme } = useThemeStore();
    const navigate = useNavigate();
    const { toggleDropdown, notifications } = useNotificationStore();
    const unreadNotifCount = notifications.filter(n => !n.isRead).length;

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const isDark = theme === 'dark';
    const displayName = profile?.display_name || profile?.username || user?.email?.split('@')[0] || 'User';
    const email = user?.email || '';

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-grey-200 dark:border-charcoal-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* LEFT SIDE: Logo + Navigation */}
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-3 group min-w-max">
                            <img
                                src={isDark ? logoDark : logoLight}
                                alt="HashTribe"
                                className="h-8 w-auto object-contain"
                            />
                            <span className="text-xl font-bold text-charcoal-900 dark:text-white tracking-tight group-hover:opacity-90 transition-opacity">
                                HashTribe
                            </span>
                        </Link>

                        {/* Navigation Links (Desktop) */}
                        {user && (
                            <div className="hidden md:flex items-center space-x-1">
                                <NavLink to="/my-tribes" icon={<Users className="w-4 h-4" />}>
                                    My Tribes
                                </NavLink>
                                <NavLink to="/tribes" icon={<Compass className="w-4 h-4" />}>
                                    Explore Tribes
                                </NavLink>
                                <NavLink to="/competitions" icon={<Trophy className="w-4 h-4" />}>
                                    Challenges
                                </NavLink>
                                <NavLink to="/leaderboard" icon={<LayoutGrid className="w-4 h-4" />}>
                                    Leaderboard
                                </NavLink>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE: Actions + Profile */}
                    <div className="flex items-center space-x-2 md:space-x-3">
                        {user ? (
                            <>
                                {/* Search & Notifications */}
                                <div className="flex items-center border-r border-grey-200 dark:border-charcoal-800 pr-3 space-x-1">
                                    <ThemeToggle />
                                    <IconButton>
                                        <Search className="w-5 h-5" />
                                    </IconButton>
                                    <div className="relative">
                                        <IconButton onClick={toggleDropdown}>
                                            <Bell className="w-5 h-5" />
                                        </IconButton>
                                        {unreadNotifCount > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60 pointer-events-none" />
                                                <span className="relative min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-black pointer-events-none">
                                                    {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                                                </span>
                                            </span>
                                        )}
                                        <NotificationDropdown />
                                    </div>
                                </div>

                                {/* User Menu & Dropdown */}
                                <div className="relative group pl-2">
                                    <Link
                                        to={profile ? `/profile/${profile.username}` : '#'}
                                        className="flex items-center py-2 focus:outline-none"
                                    >
                                        <div className="relative">
                                            <img
                                                src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${user.email || 'U'}&background=random`}
                                                alt={profile?.username || 'User'}
                                                className="w-10 h-10 rounded-full border-2 border-grey-200 dark:border-charcoal-700 group-hover:border-charcoal-900 dark:group-hover:border-white transition-colors object-cover"
                                            />
                                            {/* Online Status Indicator */}
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black"></div>
                                        </div>
                                    </Link>

                                    {/* Dropdown Menu (Hover) */}
                                    <div className="absolute right-0 top-full mt-1 w-64 rounded-xl bg-white dark:bg-charcoal-900 border border-grey-200 dark:border-charcoal-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 overflow-hidden">

                                        {/* Dropdown Header: Name & Email */}
                                        <div className="px-4 py-3 border-b border-grey-200 dark:border-charcoal-800 bg-grey-50 dark:bg-charcoal-950/50">
                                            <p className="text-charcoal-900 dark:text-white font-bold text-sm truncate">{displayName}</p>
                                            <p className="text-grey-500 text-xs truncate">{email}</p>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                to={profile ? `/profile/${profile.username}` : '#'}
                                                className="flex items-center space-x-2 px-4 py-2.5 text-sm text-grey-600 dark:text-grey-200 hover:bg-grey-100 dark:hover:bg-charcoal-800 hover:text-charcoal-900 dark:hover:text-white transition-colors"
                                            >
                                                <UserCircle className="w-4 h-4" />
                                                <span>Profile</span>
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="flex items-center space-x-2 px-4 py-2.5 text-sm text-grey-600 dark:text-grey-200 hover:bg-grey-100 dark:hover:bg-charcoal-800 hover:text-charcoal-900 dark:hover:text-white transition-colors"
                                            >
                                                <Settings className="w-4 h-4" />
                                                <span>Settings</span>
                                            </Link>
                                            <div className="border-t border-grey-200 dark:border-charcoal-800 my-1"></div>
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-colors text-left"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <ThemeToggle />
                                <Link
                                    to="/login"
                                    className="px-5 py-2.5 bg-charcoal-900 dark:bg-white text-white dark:text-black text-sm font-bold rounded-lg hover:bg-charcoal-800 dark:hover:bg-grey-200 transition-all duration-200 shadow-sm"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

