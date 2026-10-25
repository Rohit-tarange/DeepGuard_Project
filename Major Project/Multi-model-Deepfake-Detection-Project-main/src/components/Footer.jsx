import { Logo } from './icons'

const columns = [
    {
        title: 'Product',
        links: ['Features', 'How It Works', 'Technology', 'Pricing', 'API Docs'],
        hrefs: ['#features', '#how-it-works', '#technology', '#cta', '#faq'],
    },
    {
        title: 'Company',
        links: ['About', 'Careers', 'Blog', 'Press', 'Contact'],
        hrefs: ['#home', '#home', '#testimonials', '#cta', '#faq'],
    },
    {
        title: 'Resources',
        links: ['Help Center', 'Documentation', 'Community', 'Status', 'Security'],
        hrefs: ['#faq', '#technology', '#testimonials', '#home', '#cta'],
    },
    {
        title: 'Legal',
        links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
        hrefs: ['#home', '#home', '#home', '#home'],
    },
]

export default function Footer() {
    return (
        <footer className="relative border-t border-slate-100 bg-white">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
                <div className="grid gap-10 lg:grid-cols-6">
                    <div className="lg:col-span-2">
                        <a href="#home" className="flex items-center gap-2.5">
                            <Logo className="w-9 h-9" />
                            <span className="font-display text-xl font-bold tracking-tight">
                                Deep<span className="gradient-text">Guard</span>
                            </span>
                        </a>
                        <p className="mt-4 text-sm text-slate-600 max-w-xs leading-relaxed">
                            AI-powered deepfake detection platform helping organizations
                            protect truth, trust, and media integrity worldwide.
                        </p>
                        <div className="mt-6 flex gap-3">
                            {['𝕏', 'in', 'gh', '▶'].map((s, i) => (
                                <a
                                    key={i}
                                    href="#home"
                                    className="flex items-center justify-center w-10 h-10 rounded-xl glass text-slate-600 hover:text-indigo-600 hover:-translate-y-0.5 transition-all"
                                >
                                    {s}
                                </a>
                            ))}
                        </div>
                    </div>

                    {columns.map((col) => (
                        <div key={col.title}>
                            <h4 className="font-display font-bold text-slate-800">{col.title}</h4>
                            <ul className="mt-4 space-y-2.5">
                                {col.links.map((link, i) => (
                                    <li key={link}>
                                        <a
                                            href={col.hrefs[i]}
                                            className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} DeepGuard AI. All rights reserved.
                    </p>
                    <p className="text-sm text-slate-500">
                        Built with <span className="text-rose-500">♥</span> for a safer internet
                    </p>
                </div>
            </div>
        </footer>
    )
}
