import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { PublicSite } from '@/features/site/types';

interface SiteLogoProps {
  site: Pick<PublicSite, 'siteName' | 'logoUrl' | 'logoDarkUrl'>;
  className?: string;
}

/** Logo image when configured, otherwise a typographic mark. Always links home. */
const SiteLogo = ({ site, className }: SiteLogoProps) => (
  <Link href="/" className={className} aria-label={site.siteName}>
    {site.logoUrl ? (
      <>
        <Image
          src={site.logoUrl}
          alt={site.siteName}
          width={140}
          height={40}
          className="h-9 w-auto dark:hidden"
          priority
        />
        <Image
          src={site.logoDarkUrl ?? site.logoUrl}
          alt={site.siteName}
          width={140}
          height={40}
          className="hidden h-9 w-auto dark:block"
          priority
        />
      </>
    ) : (
      <span className="inline-flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-md bg-brand text-brand-ink text-h4 font-bold">
          {site.siteName.trim().charAt(0)}
        </span>
        <span className="text-h4 font-semibold tracking-tight">{site.siteName}</span>
      </span>
    )}
  </Link>
);

export default SiteLogo;
