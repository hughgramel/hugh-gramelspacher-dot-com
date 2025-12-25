import BookshelfClient, { UserBook } from './BookshelfClient';

async function getBooks(): Promise<UserBook[]> {
    const apiKey = process.env.HARDCOVER_API_KEY;

    if (!apiKey) {
        console.warn('HARDCOVER_API_KEY is missing in .env.local');
        return [];
    }

    // Fetch statuses: 1 (Want to read), 2 (Reading), 3 (Read), 5 (DNF)
    const query = `
    {
      me {
        user_books(
          where: {status_id: {_in: [1, 2, 3, 5]}} 
          order_by: {date_added: desc}
        ) {
          status_id
          rating
          review_raw
          date_added
          book {
            title
            image {
              url
            }
            cached_contributors
          }
        }
      }
    }
  `;

    try {
        const res = await fetch('https://api.hardcover.app/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey,
            },
            body: JSON.stringify({ query }),
            next: { revalidate: 3600 },
        });

        const json = await res.json();

        if (json.errors) {
            console.error('Hardcover API Errors:', json.errors);
            return [];
        }

        return json.data?.me?.[0]?.user_books || [];
    } catch (error) {
        console.error('Failed to fetch books:', error);
        return [];
    }
}

export default async function Bookshelf() {
    const books = await getBooks();

    if (books.length === 0) {
        return (
            <div className="space-y-8">
                <h1 className="text-4xl font-light tracking-tight">Bookshelf</h1>
                <div className="p-8 border border-dashed border-gray-300 rounded-lg text-gray-400 text-center">
                    <p>No books found or API key missing.</p>
                    <p className="text-sm mt-2">Check console for details.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12">
            <div className="space-y-4">
                <h1 className="text-4xl font-light tracking-tight">Bookshelf</h1>
                <p className="text-gray-500 text-lg font-light">
                    Books I've read and my thoughts on them since 2024. Tracked via <a href="https://hardcover.app" target="_blank" className="underline decoration-1 underline-offset-4 hover:opacity-70">Hardcover</a> API.
                </p>
            </div>

            <BookshelfClient initialBooks={books} />
        </div>
    );
}
