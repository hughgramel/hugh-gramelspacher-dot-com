'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { name: 'About', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Journal', path: '/journal' },
    { name: 'Bookshelf', path: '/bookshelf' },
    { name: 'Lifting', path: '/lifting' },
    { name: 'Analytics', path: '/analytics' },
];

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 h-screen w-64 bg-white z-50 p-12 flex flex-col gap-16">
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
                            className={`text-xl transition-colors text-black ${isActive
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
    );
}
