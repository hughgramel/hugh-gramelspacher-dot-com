import Link from 'next/link';

export default function Journey() {
    return (
        <div className="max-w-2xl">
            {/* Header */}
            <h1 className="text-4xl font-light tracking-tight mb-6">
                Journey
            </h1>
            <p className="text-lg leading-relaxed mb-12">
                UW CS student passionate about how technology can reshape learning through startups, entrepreneurship, and building.
            </p>

            {/* Current Focus */}
            <section className="mb-14">
                <h2 className="text-xl font-medium mb-4">
                    Current Focus
                </h2>
                <div className="space-y-4 text-lg leading-relaxed">
                    <p>
                        Product Management Intern at{' '}
                        Maximal Learning, an early-stage edtech startup looking to revolutionize how college students use software to manage their daily lives and productivity.
                    </p>
                    <p>
                        Building a 200+ community centered around social accountability and focusing, where social software augments productivity.
                    </p>
                    <p>
                        Focused on learning software engineering and improving my process in building high-quality, scalable applications.
                    </p>
                </div>
            </section>

            {/* Origins */}
            <section className="mb-14">
                <h2 className="text-xl font-medium mb-4">
                    Origins
                </h2>
                <div className="space-y-4 text-lg leading-relaxed">
                    <p>
                        When I first came to UW, I originally wanted to become a history teacher. I had a passion for education, and I saw my grandma teach for over 40 years and make a huge impact on my local community.
                    </p>
                    <p>
                        However, once I got to UW, I realized that while I had a unique passion for history, it wasn&apos;t the best way to make the impact I wanted. At the same time, I took my first programming course and realized how much I loved the creative problem-solving involved and the intensity needed to write high-quality, usable code.
                    </p>
                    <p>
                        I felt that was the path for me, and I could use that skill set to connect with my passion for education and learning to make software that could change the world through education.
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
                        After intense reflection in late 2023, I finally realized that I didn&apos;t want to continue getting my history degree. I decided to get into programming because I had always been interested in it.
                    </p>
                    <p>
                        Between March 2024 and February 2025, I focused entirely on school to maximize my grades and get into the Allen School. At the same time, I was working on personal projects including a{' '}
                        <Link
                            href="https://github.com/hughgramel/VicAnalyzerProject"
                            target="_blank"
                            className="underline underline-offset-2 hover:opacity-70"
                        >
                            save game analyzer
                        </Link>
                        {' '}for a gaming community I had been in for many years.
                    </p>
                    <p>
                        In February 2025, I got into the Allen School, a year and two months after deciding to switch from history to computer science.
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
                        <span className="text-gray-500">: Discord bot used by 200+ UW students</span>
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
                        Over the next few years, I want to improve my software engineering capabilities and skills, getting into more high-level roles at edtech startups, helping them grow and providing value through my unique insights and abilities.
                    </p>
                    <p>
                        If you&apos;re someone who cares about creative problem-solving and finding unique solutions to unsolved problems, you&apos;ll probably enjoy building with me.
                    </p>
                </div>
            </section>
        </div>
    );
}
