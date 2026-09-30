import clsx from 'clsx';
import Image from 'next/image';
import IconByName from '../IconByName';

export interface SmartImageProps {
  src?: string | null;
  alt: string;
  /** Tailwind aspect/size classes for the wrapper, e.g. `aspect-[4/3]`. */
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Icon shown on the placeholder when there is no image. */
  placeholderIcon?: string;
  imgClassName?: string;
}

/**
 * `next/image` with `fill` inside a positioned wrapper, plus a theme-aware placeholder when the
 * CMS field is empty. Always pass `sizes` so the browser downloads the right variant.
 */
const SmartImage = ({
  src,
  alt,
  className,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority,
  placeholderIcon = 'image',
  imgClassName,
}: SmartImageProps) => (
  <div className={clsx('relative overflow-hidden bg-surface-raised', className)}>
    {src ? (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={clsx('object-cover', imgClassName)}
      />
    ) : (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 flex items-center justify-center bg-pattern-dots text-ink-subtle"
      >
        <IconByName name={placeholderIcon} className="size-10 opacity-60" strokeWidth={1.25} />
      </div>
    )}
  </div>
);

export default SmartImage;
