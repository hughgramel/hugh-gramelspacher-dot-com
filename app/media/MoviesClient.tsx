'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

export interface UserMedia {
    title: string;
    year: number;
    slug: string;
    imdb_id: string;
    tmdb_id: number;
    poster_path: string | null;
    rating: number | null;
    watched_at: string;
    status: 'watched' | 'watchlist';
    mediaType: 'movie' | 'show';
}

export interface UserReview {
    id: number;
    comment: string;
    spoiler: boolean;
    review: boolean;
    created_at: string;
    rating: number | null;
    mediaType: 'movie' | 'show';
    media: {
        title: string;
        year: number;
        slug: string;
        poster_path: string | null;
    };
}

interface MoviesClientProps {
    initialMedia: UserMedia[];
    reviews: UserReview[];
}

type MediaFilter = 'all' | 'movies' | 'shows';

const SECTIONS = [
    { id: 'watched', title: 'Watched' },
    { id: 'watchlist', title: 'Watchlist' },
];

export default function MoviesClient({ initialMedia, reviews }: MoviesClientProps) {
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
    const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);
    const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');

    const handleImageError = (slug: string) => {
        setImageErrors(prev => new Set(prev).add(slug));
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Filter media based on selected filter
    const filteredMedia = initialMedia.filter(item => {
        if (mediaFilter === 'all') return true;
        if (mediaFilter === 'movies') return item.mediaType === 'movie';
        if (mediaFilter === 'shows') return item.mediaType === 'show';
        return true;
    });

    // Filter reviews based on selected filter
    const filteredReviews = reviews.filter(item => {
        if (mediaFilter === 'all') return true;
        if (mediaFilter === 'movies') return item.mediaType === 'movie';
        if (mediaFilter === 'shows') return item.mediaType === 'show';
        return true;
    });

    // Sort by date watched (most recent first)
    const sortedMedia = [...filteredMedia].sort((a, b) => {
        if (a.status !== b.status) {
            return a.status === 'watched' ? -1 : 1;
        }
        return new Date(b.watched_at).getTime() - new Date(a.watched_at).getTime();
    });

    // Count totals for filter buttons
    const movieCount = initialMedia.filter(m => m.mediaType === 'movie').length;
    const showCount = initialMedia.filter(m => m.mediaType === 'show').length;

    return (
        <div>
            {/* Media Type Filter */}
            <div className="flex gap-2 mb-8">
                <button
                    onClick={() => setMediaFilter('all')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        mediaFilter === 'all'
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    All ({initialMedia.length})
                </button>
                <button
                    onClick={() => setMediaFilter('movies')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        mediaFilter === 'movies'
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Movies ({movieCount})
                </button>
                <button
                    onClick={() => setMediaFilter('shows')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        mediaFilter === 'shows'
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Shows ({showCount})
                </button>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 items-start">

                {/* LEFT COLUMN: Media Sections (7 cols) */}
                <div className="lg:col-span-7 space-y-8">
                    {SECTIONS.map((section) => {
                        const sectionMedia = sortedMedia.filter(
                            (item) => item.status === section.id
                        );

                        if (sectionMedia.length === 0) return null;

                        return (
                            <section key={section.id} className="space-y-4">
                                <h2 className="text-lg font-medium tracking-tight border-b border-gray-100 pb-2 flex items-baseline">
                                    {section.title}
                                    <span className="text-lg text-gray-400 ml-2 font-normal">
                                        ({sectionMedia.length})
                                    </span>
                                </h2>

                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-3">
                                    {sectionMedia.map((item) => {
                                        const hasImageError = imageErrors.has(item.slug);

                                        return (
                                            <div key={`${item.mediaType}-${item.slug}`} className="group flex flex-col space-y-1.5">
                                                {/* Poster */}
                                                <div className="relative aspect-[2/3] w-full overflow-hidden rounded bg-gray-100 shadow-sm">
                                                    {item.poster_path && !hasImageError ? (
                                                        <Image
                                                            src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                                                            alt={item.title}
                                                            fill
                                                            className="object-cover"
                                                            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
                                                            onError={() => handleImageError(item.slug)}
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400 text-[10px] uppercase tracking-wide p-2 text-center leading-tight">
                                                            {item.title}
                                                        </div>
                                                    )}
                                                    {/* Media type badge */}
                                                    <div className="absolute top-1 right-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded uppercase font-medium">
                                                        {item.mediaType === 'show' ? 'TV' : 'Film'}
                                                    </div>
                                                </div>

                                                {/* Text */}
                                                <div className="flex flex-col">
                                                    {/* Fixed height for title */}
                                                    <h3 className="text-xs font-medium leading-tight text-gray-900 line-clamp-1 h-[1rem]">
                                                        {item.title}
                                                    </h3>
                                                    {/* Fixed height for year/date */}
                                                    <p className="text-[10px] font-medium text-gray-400 line-clamp-1 h-[0.875rem]">
                                                        {item.year}
                                                    </p>

                                                    {section.id === 'watched' && item.rating && (
                                                        <div className="flex items-center text-yellow-500 mt-0.5">
                                                            {Array.from({ length: 10 }).map((_, i) => (
                                                                <span
                                                                    key={i}
                                                                    className={`text-[8px] ${
                                                                        i < item.rating! ? 'opacity-100' : 'opacity-20'
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

                    {filteredMedia.length === 0 && (
                        <div className="py-12 text-center text-gray-400">
                            <p>No {mediaFilter === 'movies' ? 'movies' : mediaFilter === 'shows' ? 'shows' : 'media'} found.</p>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Reviews Sidebar (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                    <h2 className="text-lg font-medium tracking-tight border-b border-gray-100 pb-2">
                        Reviews
                    </h2>

                    {filteredReviews.length === 0 ? (
                        <p className="text-gray-400 text-sm">No written reviews yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredReviews.map((item, idx) => {
                                const isLongReview = (item.comment?.length || 0) > 200;

                                return (
                                    <div key={`${item.id}-${idx}`} className={`bg-white p-4 rounded-lg group ${isLongReview ? 'cursor-pointer' : 'cursor-default'}`} onClick={() => isLongReview && setSelectedReview(item)}>
                                        <div className="flex gap-4">
                                            {/* Left: Poster */}
                                            <div className="relative w-20 h-[7.5rem] flex-shrink-0 bg-gray-200 rounded overflow-hidden shadow-sm">
                                                {item.media.poster_path && (
                                                    <Image src={`https://image.tmdb.org/t/p/w342${item.media.poster_path}`} fill alt="Poster" className="object-cover" unoptimized />
                                                )}
                                                {/* Media type badge */}
                                                <div className="absolute top-1 right-1 bg-black/60 text-white text-[7px] px-1 py-0.5 rounded uppercase font-medium">
                                                    {item.mediaType === 'show' ? 'TV' : 'Film'}
                                                </div>
                                            </div>

                                            {/* Right: Content Stack */}
                                            <div className="flex-1 flex flex-col items-start min-w-0">
                                                <h4 className="font-medium text-sm text-gray-900 leading-tight line-clamp-1 mb-0.5">{item.media.title}</h4>

                                                {item.rating && (
                                                    <div className="flex items-center text-yellow-500 mb-2">
                                                        {Array.from({ length: 10 }).map((_, i) => (
                                                            <span key={i} className={`text-[10px] ${i < item.rating! ? 'opacity-100' : 'opacity-30'}`}>★</span>
                                                        ))}
                                                    </div>
                                                )}

                                                <p className={`text-xs text-gray-600 leading-relaxed flex-1 ${isLongReview ? 'line-clamp-3' : ''}`}>
                                                    {item.comment}
                                                </p>

                                                <div className="flex items-center justify-between mt-2 w-full">
                                                    <span className="text-[10px] font-medium text-gray-400">
                                                        {formatDate(item.created_at)}
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
            {selectedReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0"
                        onClick={() => setSelectedReview(null)}
                    />

                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200 p-8">
                        <button
                            onClick={() => setSelectedReview(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col sm:flex-row gap-8">
                            {/* Left: Poster (Larger in modal) */}
                            <div className="relative w-48 h-72 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden shadow-md mx-auto sm:mx-0">
                                {selectedReview.media.poster_path && (
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w342${selectedReview.media.poster_path}`}
                                        fill
                                        alt="Poster"
                                        className="object-cover"
                                        unoptimized
                                    />
                                )}
                            </div>

                            {/* Right: Content Stack (Full Text) */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <h2 className="text-2xl font-semibold text-gray-900 leading-tight">
                                        {selectedReview.media.title}
                                    </h2>
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded uppercase font-medium">
                                        {selectedReview.mediaType === 'show' ? 'TV Show' : 'Movie'}
                                    </span>
                                </div>

                                {selectedReview.rating && (
                                    <div className="flex items-center gap-1 text-yellow-500 mb-6">
                                        {Array.from({ length: 10 }).map((_, i) => (
                                            <span
                                                key={i}
                                                className={`text-base ${i < selectedReview.rating! ? 'opacity-100' : 'opacity-20'}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                                    {selectedReview.comment ? (
                                        selectedReview.comment
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
