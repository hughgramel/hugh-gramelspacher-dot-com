'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Quote } from 'lucide-react';

export interface HardcoverBook {
    title: string;
    pages: number | null;
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

export interface UserBookRead {
    progress_pages: number | null;
    started_at: string | null;
    finished_at: string | null;
    edition: {
        pages: number | null;
    } | null;
}

export interface UserBook {
    status_id: number;
    rating: number | null;
    review_raw: string | null;
    date_added: string;
    user_book_reads: UserBookRead[];
    book: HardcoverBook;
}

interface BookshelfClientProps {
    initialBooks: UserBook[];
}

const SECTIONS = [
    { id: 2, title: 'Currently Reading' },
    { id: 3, title: 'Read' },
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
                <div className="lg:col-span-7 space-y-8">
                    {SECTIONS.map((section) => {
                        const sectionBooks = initialBooks.filter(
                            (book) => book.status_id === section.id
                        );

                        if (sectionBooks.length === 0) return null;

                        return (
                            <section key={section.id} className="space-y-4">
                                <h2 className="text-lg font-medium tracking-tight border-b border-gray-100 pb-2 flex items-baseline">
                                    {section.title}
                                    <span className="text-lg text-gray-400 ml-2 font-normal">
                                        ({sectionBooks.length})
                                    </span>
                                </h2>

                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-3">
                                    {sectionBooks.map((item, index) => {
                                        const authorName =
                                            item.book.cached_contributors?.[0]?.name ||
                                            item.book.cached_contributors?.[0]?.author?.name ||
                                            'Unknown Author';

                                        // Calculate reading progress for currently reading books
                                        const currentRead = item.user_book_reads?.[0];
                                        const currentPage = currentRead?.progress_pages || 0;
                                        const totalPages = currentRead?.edition?.pages || item.book.pages || 0;
                                        const progressPercent = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

                                        return (
                                            <div key={index} className="group flex flex-col space-y-1.5">
                                                {/* Cover */}
                                                <div className="relative aspect-[2/3] w-full overflow-hidden rounded bg-gray-100 shadow-sm">
                                                    {item.book.image?.url ? (
                                                        <Image
                                                            src={item.book.image.url}
                                                            alt={item.book.title}
                                                            fill
                                                            className="object-cover"
                                                            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400 text-[10px] uppercase tracking-wide p-2 text-center leading-tight">
                                                            {item.book.title}
                                                        </div>
                                                    )}

                                                    {/* Hover Overlay for Review check */}
                                                    {item.review_raw && (
                                                        <div className="absolute top-1.5 right-1.5 bg-black/60 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" title="Has Review">
                                                            <Quote size={8} fill="currentColor" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Text */}
                                                <div className="flex flex-col">
                                                    {/* Fixed height for title */}
                                                    <h3 className="text-xs font-medium leading-tight text-gray-900 line-clamp-1 h-[1rem]">
                                                        {item.book.title}
                                                    </h3>
                                                    {/* Fixed height for author */}
                                                    <p className="text-[10px] text-gray-400 line-clamp-1 h-[0.875rem]">{authorName}</p>

                                                    {/* Progress bar for Currently Reading */}
                                                    {section.id === 2 && totalPages > 0 && (
                                                        <div className="pt-1 space-y-0.5">
                                                            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-emerald-500 rounded-full transition-all"
                                                                    style={{ width: `${progressPercent}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-[9px] text-gray-400">
                                                                {progressPercent}%
                                                            </p>
                                                        </div>
                                                    )}

                                                    {section.id === 3 && item.rating && (
                                                        <div className="flex items-center text-yellow-500 mt-0.5">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <span
                                                                    key={i}
                                                                    className={`text-[8px] ${i < item.rating! ? 'opacity-100' : 'opacity-20'
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
                <div className="lg:col-span-5 space-y-4">
                    <h2 className="text-lg font-medium tracking-tight border-b border-gray-100 pb-2">
                        Reviews
                    </h2>

                    {reviews.length === 0 ? (
                        <p className="text-gray-400 text-sm">No written reviews yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((item, idx) => {
                                const isLongReview = (item.review_raw?.length || 0) > 200;

                                return (
                                    <div key={idx} className={`bg-white p-4 rounded-lg group ${isLongReview ? 'cursor-pointer' : 'cursor-default'}`} onClick={() => isLongReview && setSelectedBook(item)}>
                                        <div className="flex gap-4">
                                            {/* Left: Book Cover */}
                                            <div className="relative w-16 h-24 flex-shrink-0 bg-gray-200 rounded overflow-hidden shadow-sm">
                                                {item.book.image?.url && (
                                                    <Image src={item.book.image.url} fill alt="Cover" className="object-cover" />
                                                )}
                                            </div>

                                            {/* Right: Content Stack */}
                                            <div className="flex-1 flex flex-col items-start min-w-0">
                                                <h4 className="font-medium text-sm text-gray-900 leading-tight line-clamp-1 mb-0.5">{item.book.title}</h4>

                                                {item.rating && (
                                                    <div className="flex items-center text-yellow-500 mb-2">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <span key={i} className={`text-[10px] ${i < item.rating! ? 'opacity-100' : 'opacity-30'}`}>★</span>
                                                        ))}
                                                    </div>
                                                )}

                                                <p className={`text-xs text-gray-600 leading-relaxed flex-1 ${isLongReview ? 'line-clamp-3' : ''}`}>
                                                    {item.review_raw}
                                                </p>

                                                <div className="flex items-center justify-between mt-2 w-full">
                                                    <span className="text-[10px] font-medium text-gray-400">
                                                        {formatDate(item.date_added)}
                                                    </span>

                                                    {isLongReview && (
                                                        <span className="text-[10px] font-semibold text-black group-hover:translate-x-0.5 transition-transform">
                                                            Read more →
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
