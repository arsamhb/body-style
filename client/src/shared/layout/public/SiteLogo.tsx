import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { PublicSite } from '@/features/site/types';
import { DEFAULT_LOGO, DEFAULT_LOGO_HEIGHT, DEFAULT_LOGO_WIDTH } from '@/lib/seo';

interface SiteLogoProps {
  site: Pick<PublicSite, 'siteName' | 'logoUrl'>;
  className?: string;
}

/** Configured logo when set, otherwise the Body Style mark beside the site name. Always links home. */
const SiteLogo = ({ site, className }: SiteLogoProps) => (
  <Link href="/" className={className} aria-label={site.siteName}>
    {site.logoUrl ? (
      // The public site is always light, so the light-background logo always applies.
      <Image
        src={site.logoUrl}
        alt={site.siteName}
        width={140}
        height={40}
        className="h-9 w-auto"
        priority
      />
    ) : (
      <span className="inline-flex items-center gap-2.5">
        <Image
          src={DEFAULT_LOGO}
          alt=""
          width={DEFAULT_LOGO_WIDTH}
          height={DEFAULT_LOGO_HEIGHT}
          className="h-10 w-auto"
          priority
        />
        <span className="text-h4 font-black uppercase tracking-[-0.04em]">{site.siteName}</span>
      </span>
    )}
  </Link>
);

export default SiteLogo;
