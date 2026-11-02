'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import SmartImage from '@/shared/UI/SmartImage';

interface ItemGalleryProps {
  images: string[];
  alt: string;
}

const ItemGallery = ({ images, alt }: ItemGalleryProps) => {
  const [active, setActive] = useState(0);
  const main = images[active];
  return (
    <div className="flex flex-col gap-3">
      <SmartImage
        src={main}
        alt={alt}
        priority
        className="aspect-[4/3] rounded-xs border border-line-strong"
        imgClassName="saturate-[.86] contrast-110"
        sizes="(max-width: 1024px) 100vw, 50vw"
        placeholderIcon="package"
      />
      {images.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto" role="list">
          {images.map((src, i) => (
            <li key={src + i}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={clsx(
                  'relative size-16 overflow-hidden rounded-xs border transition-colors',
                  i === active ? 'border-brand' : 'border-line hover:border-line-strong'
                )}
              >
                <Image src={src} alt="" fill sizes="64px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemGallery;
