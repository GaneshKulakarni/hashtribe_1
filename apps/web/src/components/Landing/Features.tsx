import { motion } from 'framer-motion';
import { Users, Trophy, User, Zap, Code, Target, MessageSquare,ChevronRight, TrendingUp } from 'lucide-react';

export function Features() {
    const features = [
        {
            icon: <Users className="w-6 h-6" />,
            title: 'Create & Join Tribes',
            description: 'Form or join communities around shared interests, technologies, and projects.',
            gradient: 'from-blue-500/20 to-cyan-500/20',
            border: 'border-blue-500/30'
        },
        {
            icon: <Trophy className="w-6 h-6" />,
            title: 'Compete in Challenges',
            description: 'Test your skills against developers worldwide and climb the leaderboards.',
            gradient: 'from-yellow-500/20 to-orange-500/20',
            border: 'border-yellow-500/30'
        },
        {
            icon: <Code className="w-6 h-6" />,
            title: 'Live Code Editor',
            description: 'Real-time collaborative coding with syntax highlighting and debugging.',
            gradient: 'from-green-500/20 to-emerald-500/20',
            border: 'border-green-500/30'
        },
        {
            icon: <Target className="w-6 h-6" />,
            title: 'Smart Recommendations',
            description: 'AI-powered suggestions for projects, mentors, and learning paths.',
            gradient: 'from-purple-500/20 to-pink-500/20',
            border: 'border-purple-500/30'
        },
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: 'Real-time Chat',
            description: 'Instant messaging with file sharing and code snippets.',
            gradient: 'from-red-500/20 to-rose-500/20',
            border: 'border-red-500/30'
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: 'Progress Analytics',
            description: 'Track your growth with detailed insights and performance metrics.',
            gradient: 'from-indigo-500/20 to-violet-500/20',
            border: 'border-indigo-500/30'
        },
        {
            icon: <User className="w-6 h-6" />,
            title: 'Build Your Profile',
            description: 'Auto-synced profile linked to GitHub showcasing your work.',
            gradient: 'from-cyan-500/20 to-teal-500/20',
            border: 'border-cyan-500/30'
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Collaborate & Learn',
            description: 'Work on projects, discuss solutions, and grow together.',
            gradient: 'from-orange-500/20 to-amber-500/20',
            border: 'border-orange-500/30'
        }
    ];

    return (
        <section id="features" className="relative overflow-hidden bg-black py-24 px-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
            
            <div className="relative max-w-7xl mx-auto">
                {/* Animated Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                        <Zap className="w-4 h-4 text-primary-400" />
                        <span className="text-sm font-medium text-grey-300">Powerful Features</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white font-display mb-4">
                        Everything You Need to <span className="gradient-text">Thrive</span>
                    </h2>
                    <p className="text-lg text-grey-400 max-w-2xl mx-auto">
                        Tools designed to accelerate your growth and connect you with opportunities.
                    </p>
                </motion.div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group relative"
                        >
                            {/* Card Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Main Card */}
                            <div className={`relative p-6 rounded-2xl bg-charcoal-900/50 backdrop-blur-sm border ${feature.border} transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary-500/10`}>
                                {/* Icon Container */}
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                                    <div className="text-white">
                                        {feature.icon}
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-grey-400">
                                    {feature.description}
                                </p>

                                {/* Hover Indicator */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="w-5 h-5 text-primary-400" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: '50K+', label: 'Active Members' },
                            { value: '5K+', label: 'Projects Built' },
                            { value: '98%', label: 'Satisfaction Rate' },
                            { value: '24/7', label: 'Active Support' }
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-grey-300">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}