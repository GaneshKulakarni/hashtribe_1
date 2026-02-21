import { motion } from 'framer-motion';
import { CheckCircle, Users, Zap, Shield, Globe, Award, Lock, Rocket } from 'lucide-react';

export function WhyHashTribe() {
    const pillars = [
        {
            icon: <CheckCircle className="w-6 h-6" />,
            title: 'Verified & Credible',
            description: 'Proof-based profiles linked to GitHub showcasing your real contributions and achievements.',
            features: ['GitHub Integration', 'Project Verification', 'Skill Badges'],
            gradient: 'from-green-500/20 to-emerald-500/20'
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: 'Community-Driven',
            description: 'Join niche developer communities around shared interests, technologies, and goals.',
            features: ['Specialized Tribes', 'Expert Mentors', 'Peer Reviews'],
            gradient: 'from-blue-500/20 to-cyan-500/20'
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Competitive',
            description: 'Benchmark your skills with coding challenges and climb the global rankings.',
            features: ['Live Contests', 'Skill Rankings', 'Achievement System'],
            gradient: 'from-yellow-500/20 to-orange-500/20'
        }
    ];

    const securityFeatures = [
        { icon: <Shield className="w-5 h-5" />, text: 'End-to-End Encryption' },
        { icon: <Lock className="w-5 h-5" />, text: 'Two-Factor Authentication' },
        { icon: <Globe className="w-5 h-5" />, text: 'Global Server Infrastructure' },
        { icon: <Award className="w-5 h-5" />, text: 'Industry Standard Compliance' },
    ];

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-charcoal-900 to-black py-24 px-4">
            {/* Background Elements */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            
            <div className="relative max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                        <Rocket className="w-4 h-4 text-primary-400" />
                        <span className="text-sm font-medium text-grey-300">Why Choose HashTribe</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white font-display mb-6">
                        Built for <span className="gradient-text">Developers</span>, By{' '}
                        <span className="gradient-text">Developers</span>
                    </h2>
                    <p className="text-lg text-grey-400 max-w-3xl mx-auto">
                        A platform designed from the ground up to help you grow, connect, and succeed 
                        in your developer journey.
                    </p>
                </motion.div>

                {/* Value Pillars */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    {pillars.map((pillar, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            whileHover={{ y: -10 }}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className="relative p-8 rounded-3xl bg-charcoal-900/50 backdrop-blur-sm border border-white/10 hover:border-primary-500/30 transition-all duration-300 h-full">
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <div className="text-white">
                                        {pillar.icon}
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-white mb-4">
                                    {pillar.title}
                                </h3>

                                {/* Description */}
                                <p className="text-grey-400 mb-6">
                                    {pillar.description}
                                </p>

                                {/* Features */}
                                <div className="space-y-3">
                                    {pillar.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-primary-500" />
                                            <span className="text-sm text-grey-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Decorative Line */}
                                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-primary-500/50 transition-all" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Security Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-3xl bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20 p-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-4">
                                Enterprise-Grade Security
                            </h3>
                            <p className="text-grey-300 mb-6">
                                Your data and privacy are our top priority. We use industry-leading 
                                security measures to protect your information.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {securityFeatures.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                                    <div className="p-2 rounded-lg bg-primary-500/20">
                                        {feature.icon}
                                    </div>
                                    <span className="text-sm font-medium text-white">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Testimonial */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center max-w-3xl mx-auto"
                >
                    <div className="text-3xl text-grey-400 mb-6">"</div>
                    <p className="text-xl text-grey-300 mb-6">
                        HashTribe transformed how I connect with developers. Found my dream team 
                        and landed projects I never thought possible.
                    </p>
                    
                </motion.div>
            </div>
        </section>
    );
}