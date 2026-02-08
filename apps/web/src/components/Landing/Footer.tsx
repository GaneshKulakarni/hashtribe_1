import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, FileText, Heart, Twitter, Linkedin, Mail, ChevronRight, Globe, Shield, Code } from 'lucide-react';

export function Footer() {
    const quickLinks = [
        { label: 'Explore Tribes', href: '/tribes' },
        { label: 'Challenges', href: '/challenges' },
        { label: 'Leaderboard', href: '/leaderboard' },
        { label: 'Events', href: '/events' },
    ];

    const resources = [
        { label: 'Documentation', href: '/docs', icon: <FileText className="w-4 h-4" /> },
        { label: 'API Reference', href: '/api', icon: <Code className="w-4 h-4" /> },
        { label: 'Blog', href: '/blog', icon: <FileText className="w-4 h-4" /> },
        { label: 'Tutorials', href: '/tutorials', icon: <Heart className="w-4 h-4" /> },
    ];

    const social = [
        { icon: <Twitter className="w-5 h-5" />, href: 'https://twitter.com', label: 'Twitter' },
        { icon: <Github className="w-5 h-5" />, href: 'https://github.com', label: 'GitHub' },
        { icon: <Linkedin className="w-5 h-5" />, href: 'https://linkedin.com', label: 'LinkedIn' },
        { icon: <Mail className="w-5 h-5" />, href: 'mailto:hello@hashtribe.com', label: 'Email' },
    ];

    return (
        <footer className="relative bg-black border-t border-charcoal-800">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link to="/" className="inline-block">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                                    <Code className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold text-white font-display tracking-tight">
                                    HashTribe
                                </span>
                            </div>
                        </Link>
                        <p className="text-grey-400 max-w-md">
                            A developer-first platform for building credibility, collaborating on projects, 
                            and connecting with the global developer community.
                        </p>
                        
                        {/* Newsletter */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-white">Stay Updated</h4>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 px-4 py-2 rounded-lg bg-charcoal-900 border border-charcoal-800 text-white placeholder-grey-600 focus:outline-none focus:border-primary-500"
                                />
                                <button className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">
                            Quick Links
                        </h3>
                        <nav className="space-y-3">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    className="flex items-center gap-2 text-sm text-grey-400 hover:text-primary-300 transition-colors group"
                                >
                                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">
                            Resources
                        </h3>
                        <nav className="space-y-3">
                            {resources.map((resource) => (
                                <a
                                    key={resource.label}
                                    href={resource.href}
                                    className="flex items-center gap-3 text-sm text-grey-400 hover:text-white transition-colors group"
                                >
                                    {resource.icon}
                                    {resource.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">
                            Connect
                        </h3>
                        <div className="flex gap-4 mb-6">
                            {social.map((platform) => (
                                <motion.a
                                    key={platform.label}
                                    href={platform.href}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-grey-400 hover:text-white transition-all"
                                    aria-label={platform.label}
                                >
                                    {platform.icon}
                                </motion.a>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-grey-500">
                                <Globe className="w-4 h-4" />
                                Global Community
                            </div>
                            <div className="flex items-center gap-2 text-sm text-grey-500">
                                <Shield className="w-4 h-4" />
                                100% Secure Platform
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-charcoal-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Copyright */}
                        <div className="text-center md:text-left">
                            <p className="text-sm text-grey-700">
                                © 2026 HashTribe Inc. All rights reserved.
                            </p>
                            <p className="text-xs text-grey-800 mt-1">
                                An <span className="text-white font-bold">nFKs</span> Affiliate
                            </p>
                        </div>

                        {/* Legal Links */}
                        <div className="flex flex-wrap gap-6 justify-center">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Code of Conduct'].map((item) => (
                                <a
                                    key={item}
                                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="text-xs text-grey-600 hover:text-grey-400 transition-colors"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>

                        {/* Back to Top */}
                        <motion.button
                            whileHover={{ y: -2 }}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="p-2 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-grey-400 hover:text-white transition-colors"
                            aria-label="Back to top"
                        >
                            <ChevronRight className="w-4 h-4 rotate-270" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </footer>
    );
}