import Link from 'next/link';

export default function Story() {
    return (
        <div className="max-w-2xl">
            {/* Header */}
            <h1 className="text-4xl font-light tracking-tight mb-6">
                Story
            </h1>
            <p className="text-lg leading-relaxed mb-12">
                How I went from wanting to be a history teacher to getting into the Allen School in just over a year.
            </p>

            {/* Origins */}
            <section className="mb-14">
                <h2 className="text-xl font-medium mb-4">
                    Origins
                </h2>
                <div className="space-y-4 text-lg leading-relaxed">
                    <p>
                        When I first came to UW, I wanted to become a history teacher. My grandma taught for over 40 years and made a huge impact on my local community, and I wanted to do the same.
                    </p>
                    <p>
                        However, once I got to UW, I realized that while I had a unique passion for history, it wasn&apos;t the best way to make the impact I wanted. At the same time, I took my first programming course and realized how much I loved the creative problem-solving involved and the intensity needed to write high-quality, usable code.
                    </p>
                    <p>
                        I felt that was the path for me, and I could use that skill set to build software that makes a real impact.
                    </p>
                </div>
            </section>

            {/* The Path */}
            <section className="mb-14">
                <h2 className="text-xl font-medium mb-4">
                    The Path
                </h2>
                <div className="space-y-4 text-lg leading-relaxed">
                    <p>
                        In late 2023, I decided to fully commit to computer science, something I&apos;d been drawn to due to my brother&apos;s interest in coding. Between March 2024 and February 2025, I poured myself into coursework and personal projects.
                    </p>
                    <p>
                        In February 2025, I got into the Allen School, just over a year after making the switch.
                    </p>
                </div>
            </section>

            {/* Projects */}
            <section className="mb-14">
                <h2 className="text-xl font-medium mb-4">
                    Projects
                </h2>
                <div className="space-y-3 text-lg">
                    <div>
                        <span>Donavelli Creator Discovery Platform</span>
                        <span className="text-gray-500">: Full-stack platform to find and vet YouTube creators for brand partnerships using AI</span>
                    </div>
                    <div>
                        <Link
                            href="https://github.com/hughgramel/age-of-focus"
                            target="_blank"
                            className="underline underline-offset-2 hover:opacity-70"
                        >
                            Age of Focus
                        </Link>
                        <span className="text-gray-500">: Browser-based gamified task manager where you manage a virtual historical country</span>
                    </div>
                    <div>
                        <Link
                            href="https://read-fluent.vercel.app/"
                            target="_blank"
                            className="underline underline-offset-2 hover:opacity-70"
                        >
                            ReadFluent
                        </Link>
                        <span className="text-gray-500">: AI-powered language learning app with EPUB support</span>
                    </div>
                    <div>
                        <Link
                            href="https://github.com/AmbiraDev/ambira-web"
                            target="_blank"
                            className="underline underline-offset-2 hover:opacity-70"
                        >
                            Ambira
                        </Link>
                        <span className="text-gray-500">: Social productivity tracking using Strava-style accountability</span>
                    </div>
                    <div>
                        <Link
                            href="https://github.com/hughgramel/study-together-bot"
                            target="_blank"
                            className="underline underline-offset-2 hover:opacity-70"
                        >
                            Study Together Bot
                        </Link>
                        <span className="text-gray-500">: Discord bot serving 300+ active users</span>
                    </div>
                </div>
            </section>

            {/* Looking Ahead */}
            <section className="mb-14">
                <h2 className="text-xl font-medium mb-4">
                    Looking Ahead
                </h2>
                <div className="space-y-4 text-lg leading-relaxed">
                    <p>
                        Over the next few years, I want to sharpen my software engineering skills and take on roles where I can help startups grow, providing value through my unique insights and abilities.
                    </p>
                    <p>
                        If you&apos;re someone who cares about creative problem-solving and finding unique solutions to unsolved problems, you&apos;ll probably enjoy building with me.
                    </p>
                </div>
            </section>
        </div>
    );
}
