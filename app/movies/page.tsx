import MoviesClient, { UserMovie, UserReview } from './MoviesClient';

interface TMDBMovie {
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

interface TraktRating {
    rated_at: string;
    rating: number;
    type: string;
    movie: TraktMovie;
}

interface TraktWatched {
    plays: number;
    last_watched_at: string;
    last_updated_at: string;
    movie: TraktMovie;
}

interface TraktWatchlistItem {
    rank: number;
    id: number;
    listed_at: string;
    notes: string | null;
    type: string;
    movie: TraktMovie;
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

interface TraktCommentResponse {
    comment: TraktCommentData;
    movie: TraktMovie;
}

async function fetchTMDBPosterPath(tmdbId: number): Promise<string | null> {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey || !tmdbId) return null;

    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}`,
            { next: { revalidate: 86400 } } // Cache for 24 hours
        );
        if (!res.ok) return null;
        const data: TMDBMovie = await res.json();
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

async function getMovies(): Promise<UserMovie[]> {
    const [ratings, watched, watchlist] = await Promise.all([
        fetchTraktData<TraktRating>('ratings/movies'),
        fetchTraktData<TraktWatched>('watched/movies'),
        fetchTraktData<TraktWatchlistItem>('watchlist/movies'),
    ]);

    // Create a map of ratings by movie slug for quick lookup
    const ratingsMap = new Map(
        ratings.map(r => [r.movie.ids.slug, { rating: r.rating, rated_at: r.rated_at }])
    );

    // Process watched movies (these are "seen" movies)
    const watchedMovies = watched.map(w => ({
        title: w.movie.title,
        year: w.movie.year,
        slug: w.movie.ids.slug,
        imdb_id: w.movie.ids.imdb,
        tmdb_id: w.movie.ids.tmdb,
        rating: ratingsMap.get(w.movie.ids.slug)?.rating || null,
        watched_at: w.last_watched_at,
        status: 'watched' as const,
    }));

    // Process watchlist movies
    const watchlistMovies = watchlist.map(w => ({
        title: w.movie.title,
        year: w.movie.year,
        slug: w.movie.ids.slug,
        imdb_id: w.movie.ids.imdb,
        tmdb_id: w.movie.ids.tmdb,
        rating: null,
        watched_at: w.listed_at,
        status: 'watchlist' as const,
    }));

    const allMovies = [...watchedMovies, ...watchlistMovies];

    // Fetch poster paths from TMDB for all movies
    const moviesWithPosters: UserMovie[] = await Promise.all(
        allMovies.map(async (movie) => ({
            ...movie,
            poster_path: await fetchTMDBPosterPath(movie.tmdb_id),
        }))
    );

    return moviesWithPosters;
}

async function getReviews(): Promise<UserReview[]> {
    const clientId = process.env.TRAKT_CLIENT_ID;
    const username = process.env.TRAKT_USERNAME;

    if (!clientId || !username) {
        return [];
    }

    try {
        const res = await fetch(`https://api.trakt.tv/users/${username}/comments/all/movies?extended=full`, {
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': clientId,
            },
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            console.error(`Trakt comments API error: ${res.status}`);
            return [];
        }

        const comments: TraktCommentResponse[] = await res.json();

        // Fetch poster paths for reviews
        const reviewsWithPosters = await Promise.all(
            comments.map(async (c) => ({
                id: c.comment.id,
                comment: c.comment.comment,
                spoiler: c.comment.spoiler,
                review: c.comment.review,
                created_at: c.comment.created_at,
                rating: c.comment.user_rating,
                movie: {
                    title: c.movie?.title || 'Unknown',
                    year: c.movie?.year || 0,
                    slug: c.movie?.ids?.slug || '',
                    poster_path: c.movie?.ids?.tmdb ? await fetchTMDBPosterPath(c.movie.ids.tmdb) : null,
                },
            }))
        );

        return reviewsWithPosters;
    } catch (error) {
        console.error('Failed to fetch comments:', error);
        return [];
    }
}

export default async function Movies() {
    const [movies, reviews] = await Promise.all([
        getMovies(),
        getReviews(),
    ]);

    if (movies.length === 0) {
        return (
            <div className="space-y-8">
                <h1 className="text-4xl font-light tracking-tight">Movies</h1>
                <div className="p-8 border border-dashed border-gray-300 rounded-lg text-gray-400 text-center">
                    <p>No movies found or API credentials missing.</p>
                    <p className="text-sm mt-2">Check console for details.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="space-y-4">
                <h1 className="text-4xl font-light tracking-tight">Movies</h1>
                <p className="text-lg text-gray-800 leading-relaxed">
                    Movies I&apos;ve watched and my ratings. Tracked via{' '}
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

            <MoviesClient initialMovies={movies} reviews={reviews} />
        </div>
    );
}
