import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

/**
 * ThemeToggle — An animated toggle button for switching between light and dark mode.
 * Features a smooth icon rotation, scale animation, and a glowing indicator.
 */
export function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black dark:focus:ring-offset-black focus:ring-white dark:hover:bg-charcoal-800 hover:bg-grey-200"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            id="theme-toggle-button"
        >
            <div className="relative w-5 h-5">
                {/* Sun Icon (shown in dark mode → click to go light) */}
                <motion.div
                    initial={false}
                    animate={{
                        scale: isDark ? 1 : 0,
                        rotate: isDark ? 0 : 90,
                        opacity: isDark ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="absolute inset-0"
                >
                    <Sun className="w-5 h-5 text-grey-400 group-hover:text-amber-400 transition-colors" />
                </motion.div>

                {/* Moon Icon (shown in light mode → click to go dark) */}
                <motion.div
                    initial={false}
                    animate={{
                        scale: isDark ? 0 : 1,
                        rotate: isDark ? -90 : 0,
                        opacity: isDark ? 0 : 1,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="absolute inset-0"
                >
                    <Moon className="w-5 h-5 text-charcoal-600 group-hover:text-indigo-500 transition-colors" />
                </motion.div>
            </div>

            {/* Subtle glow effect on hover */}
            <motion.div
                className="absolute inset-0 rounded-lg"
                initial={false}
                animate={{
                    boxShadow: isDark
                        ? '0 0 0px rgba(251, 191, 36, 0)'
                        : '0 0 0px rgba(99, 102, 241, 0)',
                }}
                whileHover={{
                    boxShadow: isDark
                        ? '0 0 12px rgba(251, 191, 36, 0.3)'
                        : '0 0 12px rgba(99, 102, 241, 0.3)',
                }}
                transition={{ duration: 0.3 }}
            />
        </button>
    );
}
