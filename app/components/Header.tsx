'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
    { name: 'About', path: '/' },
    { name: 'Journey', path: '/journey' },
    { name: 'Projects', path: '/projects' },
    { name: 'Bookshelf', path: '/bookshelf' },
    { name: 'Media', path: '/media' },
];

export default function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile header */}
            <header className="fixed top-0 left-0 right-0 bg-white z-50 p-4 flex items-center justify-between md:hidden">
                <h1 className="text-xl font-medium tracking-tight">
                    <Link href="/">Hugh Gramelspacher</Link>
                </h1>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 relative w-10 h-10 flex items-center justify-center"
                    aria-label="Toggle menu"
                >
                    <span
                        className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                            isMenuOpen ? 'rotate-45' : '-translate-y-2'
                        }`}
                    />
                    <span
                        className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                            isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'
                        }`}
                    />
                    <span
                        className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                            isMenuOpen ? '-rotate-45' : 'translate-y-2'
                        }`}
                    />
                </button>
            </header>

            {/* Mobile menu overlay */}
            <div
                className={`fixed top-0 left-0 right-0 bg-white z-40 pt-16 px-4 pb-6 md:hidden transition-all duration-300 ease-in-out shadow-lg ${
                    isMenuOpen
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}
            >
                <nav className="flex flex-col space-y-4">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`text-2xl transition-all duration-300 ${isActive
                                    ? 'font-semibold'
                                    : 'hover:opacity-70'
                                    }`}
                                style={{
                                    transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                                    opacity: isMenuOpen ? 1 : 0,
                                    transform: isMenuOpen ? 'translateY(0)' : 'translateY(-10px)'
                                }}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Desktop sidebar */}
            <header className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white z-50 p-12 flex-col gap-16">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight leading-tight">
                        <Link href="/">
                            Hugh
                            <br />
                            Gramelspacher
                        </Link>
                    </h1>
                </div>

                <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`text-xl transition-colors ${isActive
                                    ? 'font-semibold'
                                    : 'hover:opacity-70'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </header>
        </>
    );
}
