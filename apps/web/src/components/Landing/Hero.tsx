import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Sparkles, Code, Users, Trophy, ChevronRight, Zap, Target } from 'lucide-react';

export function Hero() {
    const highlights = [
        { icon: <Code className="w-5 h-5" />, text: 'Real-time Code Collaboration' },
        { icon: <Users className="w-5 h-5" />, text: '10,000+ Active Developers' },
        { icon: <Trophy className="w-5 h-5" />, text: 'Global Leaderboards' },
        { icon: <Target className="w-5 h-5" />, text: 'AI-Powered Recommendations' }
    ];

    return (
        <section className="relative min-h-screen bg-gradient-to-br from-charcoal-900 via-black to-charcoal-950 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative h-full px-4 sm:px-6 lg:px-8 py-32 md:py-40">
                <div className="max-w-7xl mx-auto">
                    {/* Animated Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-primary-400 animate-pulse" />
                        <span className="text-sm font-medium text-primary-300">Join the Developer Revolution</span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold text-white font-display tracking-tight leading-tight">
                            Build Your{' '}
                            <span className="gradient-text bg-gradient-to-r from-primary-400 via-white to-primary-400 bg-clip-text">
                                Developer Legacy
                            </span>
                        </h1>
                        
                        {/* Subheading */}
                        <p className="text-xl text-grey-300 mt-6 max-w-3xl">
                            Join elite communities, compete in cutting-edge challenges, and collaborate with 
                            developers worldwide. Prove your skills. Build your reputation. Shape the future.
                        </p>
                    </motion.div>

                    {/* Highlights */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 max-w-3xl"
                    >
                        {highlights.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary-500/30 transition-colors"
                            >
                                <div className="p-2 rounded-lg bg-primary-500/20">
                                    {item.icon}
                                </div>
                                <span className="text-sm font-medium text-white">{item.text}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 mt-16"
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/signup"
                                className="group relative px-8 py-4 text-base font-bold text-white rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center gap-3 shadow-lg shadow-primary-500/25"
                            >
                                <Github className="w-6 h-6" />
                                Launch with GitHub
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                        
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/demo"
                                className="group px-8 py-4 text-base font-bold text-white rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary-500/50 transition-all duration-300 flex items-center gap-3 backdrop-blur-sm"
                            >
                                <Zap className="w-6 h-6" />
                                Try Live Demo
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-2xl"
                    >
                        {[
                            { value: '50K+', label: 'Developers' },
                            { value: '5K+', label: 'Projects' },
                            { value: '98%', label: 'Satisfaction' },
                            { value: '24/7', label: 'Support' }
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-grey-400">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
            >
                <div className="text-xs text-grey-500 mb-2">Scroll to explore</div>
                <div className="w-6 h-10 border-2 border-grey-700 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-grey-600 rounded-full mt-2" />
                </div>
            </motion.div>
        </section>
    );
}