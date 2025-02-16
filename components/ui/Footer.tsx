import { socialMedia } from '@/data'
import React from 'react'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="w-full pt-3 pb-10" id="contact">
      <div className="flex flex-col items-center mt-16 space-y-4">
        <p className="md:text-base text-sm md:font-normal font-light">
          Copyright © 2025 Ratchanikorn
        </p>
        <p className="md:text-base text-sm md:font-normal font-light">
          Email : ratchanikornprompradit@gmail.com
        </p>
        <p className="md:text-base text-sm md:font-normal font-light">
          Phone : 0844924655
        </p>
        <div className="flex items-center mg:gap-3 gap-6 mt-4">
          {socialMedia.map((profile) => (
            <a
              key={profile.id}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 border rounded-full border-black-300"
            >
              <Image
                src={profile.img}
                alt={profile.id.toString()}
                width={20}
                height={20}
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
