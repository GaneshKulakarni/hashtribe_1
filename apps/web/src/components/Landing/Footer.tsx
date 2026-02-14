import { Link } from 'react-router-dom';
import { Github, FileText, Heart, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-black border-t border-charcoal-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Footer Content Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-12">

                    {/* Branding */}
                    <div>
                        <Link to="/" className="block">
                            <span className="text-lg font-bold text-white font-display">
                                HashTribe
                            </span>
                        </Link>
                        <p className="text-xs text-grey-600 mt-2">
                            A developer-first community and collaboration platform.
                        </p>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-semibold text-grey-400 uppercase tracking-wider mb-5">
                            Resources
                        </h3>
                        <nav className="space-y-2">
                            <a
                                href="https://github.com/the-mayankjha/hashtribe"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-grey-400 hover:text-white hover:translate-x-1 transition-all duration-200"
                            >
                                <Github className="w-4 h-4" />
                                GitHub
                            </a>

                            <Link
                                to="/"
                                className="text-sm text-grey-400 hover:text-white transition-colors block"
                            >
                                About HashTribe
                            </Link>

                            <a
                                href="https://github.com/the-mayankjha/hashtribe/blob/main/CONTRIBUTING.md"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-grey-400 hover:text-white hover:translate-x-1 transition-all duration-200"
                            >
                                <Heart className="w-4 h-4" />
                                Contributing Guide
                            </a>
                        </nav>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-xs font-bold text-grey-500 uppercase tracking-widest mb-4">
                            Legal
                        </h3>
                        <nav className="space-y-2">
                            <a
                                href="/privacy"
                                className="flex items-center gap-2 text-sm text-grey-400 hover:text-white hover:translate-x-1 transition-all duration-200"
                            >
                                <FileText className="w-4 h-4" />
                                Privacy Policy
                            </a>

                            <a
                                href="/terms"
                                className="flex items-center gap-2 text-sm text-grey-400 hover:text-white hover:translate-x-1 transition-all duration-200"
                            >
                                <FileText className="w-4 h-4" />
                                Terms of Service
                            </a>
                        </nav>
                    </div>

                    {/* Connect With Us */}
                    <div>
                        <h3 className="text-xs font-bold text-grey-500 uppercase tracking-widest mb-4">
                            Connect With Us
                        </h3>
                        <nav className="space-y-2">
                            <a
                                href="https://github.com/the-mayankjha/hashtribe"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-grey-400 hover:text-white hover:translate-x-1 transition-all duration-200"
                            >
                                <Github className="w-4 h-4" />
                                GitHub
                            </a>

                            <a
                                href="https://twitter.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-grey-400 hover:text-white hover:translate-x-1 transition-all duration-200"
                            >
                                <Twitter className="w-4 h-4" />
                                Twitter / X
                            </a>

                            <a
                                href="https://www.linkedin.com/in/mayankkumarjha07/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-grey-400 hover:text-white hover:translate-x-1 transition-all duration-200"
                            >
                                <Linkedin className="w-4 h-4" />
                                LinkedIn
                            </a>

                            <a
                                href="mailto:hello@hashtribe.dev"
                                className="flex items-center gap-2 text-sm text-grey-400 hover:text-white hover:translate-x-1 transition-all duration-200"
                            >
                                <Mail className="w-4 h-4" />
                                Email Us
                            </a>
                        </nav>
                    </div>

                </div>

                {/* Divider */}
                <div className="border-t border-charcoal-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-grey-600">
                        © 2026 HashTribe Inc. All rights reserved.
                    </p>
                    <p className="text-xs text-grey-700">
                        A <span className="text-white font-semibold">nFKs</span> Affiliate
                    </p>
                </div>
            </div>
        </footer>
    );
}