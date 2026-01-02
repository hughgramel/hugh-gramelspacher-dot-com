import MoviesClient, { UserMedia, UserReview } from './MoviesClient';

interface TMDBMedia {
    id: number;
    poster_path: string | null;
}

interface TraktMovie {
    title: string;
    year: number;
    ids: {
        trakt: number;
        slug: string;
        imdb: string;
        tmdb: number;
    };
}

interface TraktShow {
    title: string;
    year: number;
    ids: {
        trakt: number;
        slug: string;
        imdb: string;
        tmdb: number;
    };
}

interface TraktMovieRating {
    rated_at: string;
    rating: number;
    type: string;
    movie: TraktMovie;
}

interface TraktShowRating {
    rated_at: string;
    rating: number;
    type: string;
    show: TraktShow;
}

interface TraktMovieWatched {
    plays: number;
    last_watched_at: string;
    last_updated_at: string;
    movie: TraktMovie;
}

interface TraktShowWatched {
    plays: number;
    last_watched_at: string;
    last_updated_at: string;
    show: TraktShow;
}

interface TraktMovieWatchlistItem {
    rank: number;
    id: number;
    listed_at: string;
    notes: string | null;
    type: string;
    movie: TraktMovie;
}

interface TraktShowWatchlistItem {
    rank: number;
    id: number;
    listed_at: string;
    notes: string | null;
    type: string;
    show: TraktShow;
}

interface TraktCommentData {
    id: number;
    comment: string;
    spoiler: boolean;
    review: boolean;
    created_at: string;
    updated_at: string;
    user_rating: number | null;
}

interface TraktMovieCommentResponse {
    comment: TraktCommentData;
    movie: TraktMovie;
}

interface TraktShowCommentResponse {
    comment: TraktCommentData;
    show: TraktShow;
}

async function fetchTMDBPosterPath(tmdbId: number, mediaType: 'movie' | 'show'): Promise<string | null> {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey || !tmdbId) return null;

    const tmdbType = mediaType === 'show' ? 'tv' : 'movie';

    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/${tmdbType}/${tmdbId}?api_key=${apiKey}`,
            { next: { revalidate: 86400 } }
        );
        if (!res.ok) return null;
        const data: TMDBMedia = await res.json();
        return data.poster_path;
    } catch {
        return null;
    }
}

async function fetchTraktData<T>(endpoint: string): Promise<T[]> {
    const clientId = process.env.TRAKT_CLIENT_ID;
    const username = process.env.TRAKT_USERNAME;

    if (!clientId || !username) {
        console.warn('TRAKT_CLIENT_ID or TRAKT_USERNAME missing in .env.local');
        return [];
    }

    try {
        const res = await fetch(`https://api.trakt.tv/users/${username}/${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': clientId,
            },
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            console.error(`Trakt API error: ${res.status} ${res.statusText}`);
            return [];
        }

        return res.json();
    } catch (error) {
        console.error('Failed to fetch from Trakt:', error);
        return [];
    }
}

async function getMedia(): Promise<UserMedia[]> {
    const [
        movieRatings,
        showRatings,
        moviesWatched,
        showsWatched,
        movieWatchlist,
        showWatchlist,
    ] = await Promise.all([
        fetchTraktData<TraktMovieRating>('ratings/movies'),
        fetchTraktData<TraktShowRating>('ratings/shows'),
        fetchTraktData<TraktMovieWatched>('watched/movies'),
        fetchTraktData<TraktShowWatched>('watched/shows'),
        fetchTraktData<TraktMovieWatchlistItem>('watchlist/movies'),
        fetchTraktData<TraktShowWatchlistItem>('watchlist/shows'),
    ]);

    // Create maps of ratings by slug for quick lookup
    const movieRatingsMap = new Map(
        movieRatings.map(r => [r.movie.ids.slug, { rating: r.rating, rated_at: r.rated_at }])
    );
    const showRatingsMap = new Map(
        showRatings.map(r => [r.show.ids.slug, { rating: r.rating, rated_at: r.rated_at }])
    );

    // Process watched movies
    const watchedMovies = moviesWatched.map(w => ({
        title: w.movie.title,
        year: w.movie.year,
        slug: w.movie.ids.slug,
        imdb_id: w.movie.ids.imdb,
        tmdb_id: w.movie.ids.tmdb,
        poster_path: null as string | null,
        rating: movieRatingsMap.get(w.movie.ids.slug)?.rating || null,
        watched_at: w.last_watched_at,
        status: 'watched' as const,
        mediaType: 'movie' as const,
    }));

    // Process watched shows
    const watchedShows = showsWatched.map(w => ({
        title: w.show.title,
        year: w.show.year,
        slug: w.show.ids.slug,
        imdb_id: w.show.ids.imdb,
        tmdb_id: w.show.ids.tmdb,
        poster_path: null as string | null,
        rating: showRatingsMap.get(w.show.ids.slug)?.rating || null,
        watched_at: w.last_watched_at,
        status: 'watched' as const,
        mediaType: 'show' as const,
    }));

    // Process movie watchlist
    const watchlistMovies = movieWatchlist.map(w => ({
        title: w.movie.title,
        year: w.movie.year,
        slug: w.movie.ids.slug,
        imdb_id: w.movie.ids.imdb,
        tmdb_id: w.movie.ids.tmdb,
        poster_path: null as string | null,
        rating: null,
        watched_at: w.listed_at,
        status: 'watchlist' as const,
        mediaType: 'movie' as const,
    }));

    // Process show watchlist
    const watchlistShows = showWatchlist.map(w => ({
        title: w.show.title,
        year: w.show.year,
        slug: w.show.ids.slug,
        imdb_id: w.show.ids.imdb,
        tmdb_id: w.show.ids.tmdb,
        poster_path: null as string | null,
        rating: null,
        watched_at: w.listed_at,
        status: 'watchlist' as const,
        mediaType: 'show' as const,
    }));

    const allMedia = [...watchedMovies, ...watchedShows, ...watchlistMovies, ...watchlistShows];

    // Fetch poster paths from TMDB for all media
    const mediaWithPosters: UserMedia[] = await Promise.all(
        allMedia.map(async (item) => ({
            ...item,
            poster_path: await fetchTMDBPosterPath(item.tmdb_id, item.mediaType),
        }))
    );

    return mediaWithPosters;
}

async function getReviews(): Promise<UserReview[]> {
    const clientId = process.env.TRAKT_CLIENT_ID;
    const username = process.env.TRAKT_USERNAME;

    if (!clientId || !username) {
        return [];
    }

    try {
        const [movieCommentsRes, showCommentsRes] = await Promise.all([
            fetch(`https://api.trakt.tv/users/${username}/comments/all/movies?extended=full`, {
                headers: {
                    'Content-Type': 'application/json',
                    'trakt-api-version': '2',
                    'trakt-api-key': clientId,
                },
                next: { revalidate: 3600 },
            }),
            fetch(`https://api.trakt.tv/users/${username}/comments/all/shows?extended=full`, {
                headers: {
                    'Content-Type': 'application/json',
                    'trakt-api-version': '2',
                    'trakt-api-key': clientId,
                },
                next: { revalidate: 3600 },
            }),
        ]);

        const movieComments: TraktMovieCommentResponse[] = movieCommentsRes.ok
            ? await movieCommentsRes.json()
            : [];
        const showComments: TraktShowCommentResponse[] = showCommentsRes.ok
            ? await showCommentsRes.json()
            : [];

        // Process movie reviews
        const movieReviews = await Promise.all(
            movieComments.map(async (c) => ({
                id: c.comment.id,
                comment: c.comment.comment,
                spoiler: c.comment.spoiler,
                review: c.comment.review,
                created_at: c.comment.created_at,
                rating: c.comment.user_rating,
                mediaType: 'movie' as const,
                media: {
                    title: c.movie?.title || 'Unknown',
                    year: c.movie?.year || 0,
                    slug: c.movie?.ids?.slug || '',
                    poster_path: c.movie?.ids?.tmdb
                        ? await fetchTMDBPosterPath(c.movie.ids.tmdb, 'movie')
                        : null,
                },
            }))
        );

        // Process show reviews
        const showReviews = await Promise.all(
            showComments.map(async (c) => ({
                id: c.comment.id,
                comment: c.comment.comment,
                spoiler: c.comment.spoiler,
                review: c.comment.review,
                created_at: c.comment.created_at,
                rating: c.comment.user_rating,
                mediaType: 'show' as const,
                media: {
                    title: c.show?.title || 'Unknown',
                    year: c.show?.year || 0,
                    slug: c.show?.ids?.slug || '',
                    poster_path: c.show?.ids?.tmdb
                        ? await fetchTMDBPosterPath(c.show.ids.tmdb, 'show')
                        : null,
                },
            }))
        );

        return [...movieReviews, ...showReviews].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    } catch (error) {
        console.error('Failed to fetch comments:', error);
        return [];
    }
}

export default async function Media() {
    const [media, reviews] = await Promise.all([
        getMedia(),
        getReviews(),
    ]);

    if (media.length === 0) {
        return (
            <div className="space-y-8">
                <h1 className="text-4xl font-light tracking-tight">Media</h1>
                <div className="p-8 border border-dashed border-gray-300 rounded-lg text-gray-400 text-center">
                    <p>No media found or API credentials missing.</p>
                    <p className="text-sm mt-2">Check console for details.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="space-y-4">
                <h1 className="text-4xl font-light tracking-tight">Media</h1>
                <p className="text-lg text-gray-800 leading-relaxed">
                    Movies and shows I&apos;ve watched and my ratings. Tracked via{' '}
                    <a
                        href="https://trakt.tv"
                        target="_blank"
                        className="underline decoration-1 underline-offset-4 hover:opacity-70"
                    >
                        Trakt
                    </a>{' '}
                    API. Covers from{' '}
                    <a
                        href="https://www.themoviedb.org"
                        target="_blank"
                        className="underline decoration-1 underline-offset-4 hover:opacity-70"
                    >
                        TMDB
                    </a>.
                </p>
            </div>

            <MoviesClient initialMedia={media} reviews={reviews} />
        </div>
    );
}
