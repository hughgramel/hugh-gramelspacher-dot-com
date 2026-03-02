import Image from "next/image";
import Link from "next/link";
import { Linkedin, Github, Mail, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-light tracking-tight mb-8">About</h1>

      {/* Mobile: image on top */}
      <div className="md:hidden flex justify-center mb-6">
        <Image
          src="/hugh-v2.png"
          alt="Hugh Gramelspacher"
          width={280}
          height={280}
          className="rounded-xl object-cover"
          priority
        />
      </div>

      <div className="block">
        <div className="relative float-right ml-8 mb-2 w-[280px] hidden md:block">
          <Image
            src="/hugh-v2.png"
            alt="Hugh Gramelspacher"
            width={280}
            height={280}
            className="rounded-xl object-cover"
            priority
          />
        </div>
        <div className="text-lg leading-relaxed text-gray-800 space-y-6">
          <p>
            I am a CS student at the University of Washington passionate about building software through startups, entrepreneurship, and creative problem-solving.
          </p>
          <p>
            I originally came to UW to become a history teacher, inspired by my grandmother who taught for over 40 years. After taking my first programming course, I discovered a love for creative problem-solving and realized I could use that skill set to build software that changes lives.
          </p>
          <p>
            Outside of work, I enjoy reading historical literature, building side projects, and strategy games focused on history, politics, and economic systems. I also love movies and storytelling.
          </p>
          <p>
            Feel free to reach out to me online!
          </p>

          <div className="pt-2 clear-both">
            <Link href="/story" className="inline-flex items-center gap-2 group text-gray-600 hover:text-black transition-colors">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span className="text-lg text-gray-800">Story</span>
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
