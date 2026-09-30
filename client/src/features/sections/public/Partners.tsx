import Image from 'next/image';
import SectionShell from '@/shared/UI/SectionShell';
import type { SectionComponentProps } from '../types';

const Partners = ({ section }: SectionComponentProps<'partners'>) => {
  const { heading, logos } = section.props;
  return (
    <SectionShell id={section.key} heading={heading} align="center" size="sm">
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6" role="list">
        {logos.map((logo, i) => {
          const img = (
            <Image
              src={logo.image}
              alt={logo.name}
              width={160}
              height={64}
              className="h-10 w-auto object-contain opacity-60 grayscale transition duration-base ease-out-expo hover:opacity-100 hover:grayscale-0"
            />
          );
          return (
            <li key={i}>
              {logo.href ? (
                <a
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={logo.name}
                >
                  {img}
                </a>
              ) : (
                img
              )}
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
};

export default Partners;
