import Link from 'next/link';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import projectsData from '@/public/projects.json';

function ProjectImages({ images, projectId }: { images: string[]; projectId: string }) {
    if (images.length === 0) return null;
    return (
        <div className="grid grid-cols-2 gap-3 mt-4">
            {images.map((filename, index) => (
                <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                        src={`/projects/${filename}`}
                        alt={`${projectId} screenshot ${index + 1}`}
                        fill
                        className="object-cover"
                    />
                </div>
            ))}
        </div>
    );
}

export default function Projects() {
    return (
        <div className="max-w-2xl">
            <h1 className="text-4xl font-light tracking-tight mb-6">Projects</h1>
            <p className="text-lg leading-relaxed mb-12">
                A collection of things I've built, from productivity tools to language learning apps.
            </p>

            <div className="space-y-12">
                {projectsData.projects.map((project) => (
                    <div key={project.id} className="space-y-3">
                        <h2 className="text-xl font-medium">
                            <Link
                                href={project.url}
                                target="_blank"
                                className="inline-flex items-center gap-2 hover:opacity-70"
                            >
                                <FaGithub size={18} />
                                {project.name}
                            </Link>
                        </h2>
                        <p className="text-lg text-gray-500 italic">
                            {project.description}
                        </p>
                        <p className="text-lg text-gray-700">
                            {project.review}
                        </p>
                        <ProjectImages images={project.images} projectId={project.id} />
                    </div>
                ))}
            </div>
        </div>
    );
}
