'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface JourneyItem {
    year: string;
    title: string;
    description: string;
    imageSrc: string; // Using a placeholder for now
}

const journeyItems: JourneyItem[] = [
    {
        year: 'June 2024',
        title: 'University of Washington',
        description: 'Started my journey in Computer Science, diving deep into algorithms, systems, and software engineering principles.',
        imageSrc: '/hugh-v2.png',
    },
    {
        year: '2024',
        title: 'Summer Internship',
        description: 'Gained industry experience working on backend systems and cloud infrastructure.',
        imageSrc: '/hugh-v2.png',
    },
    {
        year: '2023',
        title: 'First Hackathon',
        description: 'Collaborated with a team to build a web app in 24 hours. Learned the importance of rapid prototyping and teamwork.',
        imageSrc: '/hugh-v2.png',
    },
    {
        year: '2023',
        title: 'Launched First Project',
        description: 'Deployed my first full-stack application to the web. Discovered a passion for creating tools that solve real-world problems.',
        imageSrc: '/hugh-v2.png',
    },
    {
        year: '2023',
        title: 'Personal Website',
        description: 'Designed and built my portfolio site to showcase my work and thoughts.',
        imageSrc: '/hugh-v2.png',
    },
    {
        year: '2022',
        title: 'Open Source Contribution',
        description: 'Made my first pull request to an open source library. Learned about code review and maintenance.',
        imageSrc: '/hugh-v2.png',
    },
    {
        year: '2022',
        title: 'Machine Learning Course',
        description: 'Completed a course on ML fundamentals. Built a simple image classifier.',
        imageSrc: '/hugh-v2.png',
    },
    {
        year: '2022',
        title: 'High School Graduation',
        description: 'Graduated with honors. Developed a strong foundation in mathematics and logic that serves me well in engineering.',
        imageSrc: '/hugh-v2.png',
    },
    {
        year: '2021',
        title: 'Started Lifting',
        description: 'Began my fitness journey, learning discipline and consistency through weightlifting.',
        imageSrc: '/hugh-v2.png',
    },
    {
        year: '2021',
        title: 'Learned React',
        description: 'Moved beyond vanilla JS and fell in love with component-based architecture.',
        imageSrc: '/hugh-v2.png',
    },
    {
        year: '2020',
        title: 'First Custom PC',
        description: 'Researched parts and built my own desktop computer. Sparked an interest in hardware.',
        imageSrc: '/hugh-v2.png',
    },
    {
        year: '2019',
        title: 'Python Scripts',
        description: 'Wrote simple scripts to automate daily tasks and solve math problems.',
        imageSrc: '/hugh-v2.png',
    },
    {
        year: '2018',
        title: '"Hello, World!"',
        description: 'Wrote my first line of code. The beginning of it all.',
        imageSrc: '/hugh-v2.png',
    },
];

export default function Journey() {
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target); // Only animate once
                    }
                });
            },
            {
                threshold: 0.15, // Trigger when 15% of the item is visible
                rootMargin: '0px 0px -50px 0px', // Trigger slightly before it hits the bottom
            }
        );

        itemsRef.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="space-y-16">
            <style jsx global>{`
                .journey-item {
                    opacity: 0;
                    transform: translateY(40px);
                    transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
                .journey-item.in-view {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
            <div>
                <h1 className="text-4xl font-light tracking-tight mb-4">Journey</h1>
                <p className="text-gray-500 text-lg font-light">A timeline of my professional and personal milestones.</p>
            </div>

            <div className="flex flex-col space-y-24 relative">
                {/* Vertical Line (Optional - stylistic choice) */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2 hidden md:block" />

                {journeyItems.map((item, index) => (
                    <div
                        key={index}
                        ref={(el) => { itemsRef.current[index] = el; }}
                        className="flex flex-col md:flex-row items-center gap-8 md:gap-16 journey-item"
                    >
                        {/* Even items: Image Left, Text Right */}
                        {index % 2 === 0 ? (
                            <>
                                <div className="flex-1 w-full flex justify-center md:justify-end">
                                    <div className="w-full max-w-[320px] aspect-square bg-neutral-200 rounded-xl" />
                                </div>
                                <div className="flex-1 w-full text-center md:text-left pt-4 md:pt-0">
                                    <span className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-2 block">{item.year}</span>
                                    <h3 className="text-2xl font-light mb-4">{item.title}</h3>
                                    <p className="text-gray-600 leading-relaxed max-w-md mx-auto md:mx-0">
                                        {item.description}
                                    </p>
                                </div>
                            </>
                        ) : (
                            /* Odd items: Text Left, Image Right */
                            <>
                                <div className="flex-1 w-full text-center md:text-right order-2 md:order-1 pt-4 md:pt-0">
                                    <span className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-2 block">{item.year}</span>
                                    <h3 className="text-2xl font-light mb-4">{item.title}</h3>
                                    <p className="text-gray-600 leading-relaxed max-w-md mx-auto md:ml-auto md:mr-0">
                                        {item.description}
                                    </p>
                                </div>
                                <div className="flex-1 w-full flex justify-center md:justify-start order-1 md:order-2">
                                    <div className="w-full max-w-[320px] aspect-square bg-neutral-200 rounded-xl" />
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
