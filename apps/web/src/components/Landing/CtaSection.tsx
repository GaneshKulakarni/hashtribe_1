import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Shield, Globe, Rocket } from 'lucide-react';

export function CtaSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-charcoal-900 via-black to-charcoal-950 py-24 px-4">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-500/5 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary-500/5 to-transparent rounded-full translate-x-1/3 translate-y-1/3" />
            
            <div className="relative max-w-3xl mx-auto text-center space-y-10">
                {/* Animated Badge */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30"
                >
                    <Sparkles className="w-4 h-4 text-primary-400 animate-pulse" />
                    <span className="text-sm font-medium text-primary-300">Join 10,000+ Developers</span>
                </motion.div>

                {/* Headline with Typing Effect */}
                <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-white font-display bg-gradient-to-r from-white via-white to-grey-400 bg-clip-text text-transparent">
                        Ready to Build Your Legacy?
                    </h2>
                    <p className="text-lg text-grey-300 max-w-2xl mx-auto">
                        Start building your credibility, connect with elite developers, and accelerate your career growth.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
                    {[
                        { value: '24h', label: 'Avg. Response Time' },
                        { value: '98%', label: 'Satisfaction Rate' },
                        { value: '10k+', label: 'Active Developers' }
                    ].map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                        >
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-xs text-grey-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Buttons with Hover Effects */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to="/signup"
                            className="group relative px-8 py-4 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary-500/25"
                        >
                            <Rocket className="w-5 h-5" />
                            Launch Your Profile
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to="/explore"
                            className="group px-8 py-4 text-sm font-bold text-white rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary-500/50 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
                        >
                            <Globe className="w-5 h-5" />
                            Explore Community
                        </Link>
                    </motion.div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
                    {['GitHub Verified', 'SSL Secured', '24/7 Support'].map((badge) => (
                        <div key={badge} className="flex items-center gap-2 text-sm text-grey-500">
                            <Shield className="w-4 h-4" />
                            {badge}
                        </div>
                    ))}
                </div>

                {/* Microcopy */}
                <p className="text-xs text-grey-600 pt-4">
                    Free forever • No credit card required • Cancel anytime
                </p>
            </div>
        </section>
    );
}
