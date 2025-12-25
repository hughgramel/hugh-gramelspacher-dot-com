'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Quote } from 'lucide-react';

export interface HardcoverBook {
    title: string;
    image: {
        url: string;
    };
    cached_contributors: Array<{
        author: {
            name: string;
        };
        name?: string;
    }>;
}

export interface UserBook {
    status_id: number;
    rating: number | null;
    review_raw: string | null;
    date_added: string;
    book: HardcoverBook;
}

interface BookshelfClientProps {
    initialBooks: UserBook[];
}

const SECTIONS = [
    { id: 3, title: 'Read' },
    { id: 2, title: 'Currently Reading' },
    { id: 5, title: 'Did Not Finish' },
    { id: 1, title: 'Want to Read' },
];

export default function BookshelfClient({ initialBooks }: BookshelfClientProps) {
    const [selectedBook, setSelectedBook] = useState<UserBook | null>(null);

    // Filter books that have actual review text
    const reviews = initialBooks.filter(
        (book) => book.review_raw && book.review_raw.trim().length > 0
    );

    // Helper to format review text
    const formatReview = (text: string) => {
        return text.replace(/(?<=[.!?])(?=[A-Z])/g, '\n\n');
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div>
            <div className="grid lg:grid-cols-12 gap-12 items-start">

                {/* LEFT COLUMN: Library Sections (7 cols) */}
                <div className="lg:col-span-7 space-y-24">
                    {SECTIONS.map((section) => {
                        const sectionBooks = initialBooks.filter(
                            (book) => book.status_id === section.id
                        );

                        if (sectionBooks.length === 0) return null;

                        return (
                            <section key={section.id} className="space-y-8">
                                <h2 className="text-2xl font-light tracking-tight border-b border-gray-100 pb-2 flex items-baseline">
                                    {section.title}
                                    <span className="text-2xl text-gray-300 ml-3 font-light">
                                        ({sectionBooks.length})
                                    </span>
                                </h2>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                                    {sectionBooks.map((item, index) => {
                                        const authorName =
                                            item.book.cached_contributors?.[0]?.name ||
                                            item.book.cached_contributors?.[0]?.author?.name ||
                                            'Unknown Author';

                                        return (
                                            <div key={index} className="group flex flex-col space-y-3">
                                                {/* Cover */}
                                                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-gray-100 shadow-sm text-center">
                                                    {item.book.image?.url ? (
                                                        <Image
                                                            src={item.book.image.url}
                                                            alt={item.book.title}
                                                            fill
                                                            className="object-cover"
                                                            sizes="(max-width: 768px) 50vw, 33vw"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest">
                                                            No Cover
                                                        </div>
                                                    )}

                                                    {/* Hover Overlay for Review check (optional as we have sidebar now, but good to keep) */}
                                                    {item.review_raw && (
                                                        <div className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" title="Has Review">
                                                            <Quote size={12} fill="currentColor" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Text */}
                                                <div className="space-y-1">
                                                    <h3 className="text-base font-medium leading-tight text-gray-900 line-clamp-2 group-hover:text-black">
                                                        {item.book.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 line-clamp-1">{authorName}</p>

                                                    {section.id === 3 && item.rating && (
                                                        <div className="flex items-center gap-1 text-yellow-500 pt-1">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <span
                                                                    key={i}
                                                                    className={`text-xs ${i < item.rating! ? 'opacity-100' : 'opacity-20'
                                                                        }`}
                                                                >
                                                                    ★
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}

                    {initialBooks.length === 0 && (
                        <div className="py-12 text-center text-gray-400">
                            <p>No books found.</p>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Reviews Sidebar (5 cols) */}
                <div className="lg:col-span-5 space-y-8">
                    <h2 className="text-2xl font-light tracking-tight border-b border-gray-100 pb-2">
                        Reviews
                    </h2>

                    {reviews.length === 0 ? (
                        <p className="text-gray-400 text-sm">No written reviews yet.</p>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((item, idx) => {
                                const isLongReview = (item.review_raw?.length || 0) > 280;

                                return (
                                    <div key={idx} className={`bg-white p-6 rounded-xl group ${isLongReview ? 'cursor-pointer' : 'cursor-default'}`} onClick={() => isLongReview && setSelectedBook(item)}>
                                        <div className="flex gap-6">
                                            {/* Left: Book Cover */}
                                            <div className="relative w-32 h-48 flex-shrink-0 bg-gray-200 rounded overflow-hidden shadow-sm">
                                                {item.book.image?.url && (
                                                    <Image src={item.book.image.url} fill alt="Cover" className="object-cover" />
                                                )}
                                            </div>

                                            {/* Right: Content Stack */}
                                            <div className="flex-1 flex flex-col items-start min-w-0">
                                                <h4 className="font-medium text-xl text-gray-900 leading-tight line-clamp-2 mb-1">{item.book.title}</h4>

                                                {item.rating && (
                                                    <div className="flex items-center gap-0.5 text-yellow-500 mb-3">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <span key={i} className={`text-sm ${i < item.rating! ? 'opacity-100' : 'opacity-30'}`}>★</span>
                                                        ))}
                                                    </div>
                                                )}

                                                <p className={`text-sm text-gray-600 leading-relaxed mb-4 flex-1 ${isLongReview ? 'line-clamp-4' : ''}`}>
                                                    {item.review_raw}
                                                </p>

                                                <div className="flex flex-col items-start gap-2 mt-auto w-full">
                                                    <span className="text-sm font-bold text-gray-400">
                                                        {formatDate(item.date_added)}
                                                    </span>

                                                    {isLongReview && (
                                                        <span className="text-sm font-semibold text-black inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                            Read Full Review &rarr;
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>

            {/* Review Modal */}
            {selectedBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0"
                        onClick={() => setSelectedBook(null)}
                    />

                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200 p-8">
                        <button
                            onClick={() => setSelectedBook(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col sm:flex-row gap-8">
                            {/* Left: Book Cover (Larger in modal) */}
                            <div className="relative w-48 h-72 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden shadow-md mx-auto sm:mx-0">
                                {selectedBook.book.image?.url && (
                                    <Image
                                        src={selectedBook.book.image.url}
                                        fill
                                        alt="Cover"
                                        className="object-cover"
                                    />
                                )}
                            </div>

                            {/* Right: Content Stack (Full Text) */}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-semibold text-gray-900 leading-tight mb-2">
                                    {selectedBook.book.title}
                                </h2>

                                {selectedBook.rating && (
                                    <div className="flex items-center gap-1 text-yellow-500 mb-6">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span
                                                key={i}
                                                className={`text-base ${i < selectedBook.rating! ? 'opacity-100' : 'opacity-20'}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                                    {selectedBook.review_raw ? (
                                        formatReview(selectedBook.review_raw)
                                            .split('\n\n')
                                            .map((paragraph, idx) => (
                                                <p key={idx} className="mb-4">
                                                    {paragraph}
                                                </p>
                                            ))
                                    ) : (
                                        <p className="text-gray-400 italic">No text review provided.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
