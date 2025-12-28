import Link from 'next/link';

export default function Projects() {
    return (
        <div className="max-w-2xl">
            <h1 className="text-4xl font-light tracking-tight mb-6">Projects</h1>
            <p className="text-lg leading-relaxed mb-12">
                A collection of things I've built, from productivity tools to language learning apps.
            </p>

            <div className="space-y-8">
                {/* Age of Focus */}
                <div className="space-y-2">
                    <h2 className="text-xl font-medium">
                        <Link
                            href="https://github.com/hughgramel/age-of-focus"
                            target="_blank"
                            className="underline underline-offset-2 hover:opacity-70"
                        >
                            Age of Focus
                        </Link>
                    </h2>
                    <p className="text-lg text-gray-500">
                        Browser-based gamified task manager where you manage a virtual historical country. Complete tasks to grow your nation, build infrastructure, and expand your empire.
                    </p>
                </div>

                {/* ReadFluent */}
                <div className="space-y-2">
                    <h2 className="text-xl font-medium">
                        <Link
                            href="https://read-fluent.vercel.app/"
                            target="_blank"
                            className="underline underline-offset-2 hover:opacity-70"
                        >
                            ReadFluent
                        </Link>
                    </h2>
                    <p className="text-lg text-gray-500">
                        AI-powered language learning app with EPUB support. Read books in your target language with instant translations and vocabulary tracking.
                    </p>
                </div>

                {/* Ambira */}
                <div className="space-y-2">
                    <h2 className="text-xl font-medium">
                        <Link
                            href="https://github.com/AmbiraDev/ambira-web"
                            target="_blank"
                            className="underline underline-offset-2 hover:opacity-70"
                        >
                            Ambira
                        </Link>
                    </h2>
                    <p className="text-lg text-gray-500">
                        Social productivity tracking using Strava-style accountability. Share your focus sessions and stay motivated with friends.
                    </p>
                </div>

                {/* Study Together Bot */}
                <div className="space-y-2">
                    <h2 className="text-xl font-medium">
                        <Link
                            href="https://github.com/hughgramel/study-together-bot"
                            target="_blank"
                            className="underline underline-offset-2 hover:opacity-70"
                        >
                            Study Together Bot
                        </Link>
                    </h2>
                    <p className="text-lg text-gray-500">
                        Discord bot used by 200+ UW students for coordinating study sessions and building accountability within the community.
                    </p>
                </div>

                {/* VicAnalyzer */}
                <div className="space-y-2">
                    <h2 className="text-xl font-medium">
                        <Link
                            href="https://github.com/hughgramel/VicAnalyzerProject"
                            target="_blank"
                            className="underline underline-offset-2 hover:opacity-70"
                        >
                            VicAnalyzer
                        </Link>
                    </h2>
                    <p className="text-lg text-gray-500">
                        Save game analyzer for the Victoria series gaming community. Parse and visualize game data to track progress and compare statistics.
                    </p>
                </div>

                {/* UW Course Scraper */}
                <div className="space-y-2">
                    <h2 className="text-xl font-medium">
                        <Link
                            href="https://github.com/hughgramel/uw-web-scraper"
                            target="_blank"
                            className="underline underline-offset-2 hover:opacity-70"
                        >
                            UW Course Scraper
                        </Link>
                    </h2>
                    <p className="text-lg text-gray-500">
                        Python web scraper for extracting UW course offerings. Features CLI interface, structured JSON output, and support for all departments and quarters.
                    </p>
                </div>
            </div>
        </div>
    );
}
