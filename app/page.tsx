import Image from "next/image";
import Link from "next/link";
import { Linkedin, Github, Mail, ArrowRight } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-light tracking-tight mb-8">About</h1>
      <div className="block">
        <div className="relative float-right ml-8 mb-2 w-[280px]">
          <Image
            src="/hugh-v2.png"
            alt="Hugh Gramelspacher"
            width={280}
            height={280}
            className="rounded-xl object-cover grayscale-0"
            priority
          />
        </div>
        <div className="text-base md:text-lg leading-relaxed text-gray-800 font-light space-y-6">
          <p>
            I am a CS student at the University of Washington passionate about engineering software to improve people&#39;s lives through technology and innovation.
          </p>
          <p>
            I am looking for Software Engineering internships and full-time opportunities, roles where I can grow as a developer, and projects that make a meaningful impact.
          </p>
          <p>
            Outside of work, I enjoy reading and exploring historical literature, building side projects, experimenting with new technologies, and analyzing fantasy sports statistics. I also love movies, storytelling, and strategy games focused on historical periods, politics, warfare, and economic systems.
          </p>
          <p>
            Feel free to reach out to me online!
          </p>

          <div className="pt-2 clear-both">
            <Link href="/journey" className="inline-flex items-center gap-2 group text-gray-600 hover:text-black transition-colors">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span className="text-lg font-light">Hugh&apos;s Journey</span>
            </Link>
          </div>

          <div className="pt-4 flex flex-col items-start gap-4 text-gray-500 text-sm md:text-base clear-both">


            <div className="flex items-center space-x-6">
              <Link
                href="https://www.linkedin.com/in/hugh-gramelspacher"
                target="_blank"
                className="hover:text-black transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={22} />
              </Link>
              <Link
                href="https://x.com/hughthebuilder"
                target="_blank"
                className="hover:text-black transition-colors"
                aria-label="X (Twitter)"
              >
                <FaXTwitter size={22} />
              </Link>
              <Link
                href="https://github.com/hughgramel"
                target="_blank"
                className="hover:text-black transition-colors"
                aria-label="GitHub"
              >
                <Github size={22} />
              </Link>
              <a
                href="mailto:hughgramelspacher@gmail.com"
                className="hover:text-black transition-colors"
                aria-label="Email"
              >
                <Mail size={22} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
