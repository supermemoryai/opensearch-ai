import { cn } from '@/lib/utils';
import React from 'react';

function Card({
  link,
  className,
  title,
  description,
}: {
  link: string;
  className: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={link}
      className={cn`group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 ${className}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <h2 className={`mb-3 text-2xl font-semibold`}>
        {title}{' '}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>{description}</p>
    </a>
  );
}

export default Card;
