import { useTranslations } from 'next-intl';
import Container from '@/shared/UI/Container';
import { ctaClassName } from '@/shared/UI/Cta';
import IconByName from '@/shared/UI/IconByName';
import Paragraphs from '@/shared/UI/Paragraphs';
import SmartImage from '@/shared/UI/SmartImage';
import { contactWayHref } from '@/features/site/contactWays';
import PageHero from './PageHero';
import type { SectionComponentProps } from '../types';

/**
 * Top of the contact page. Without a photo it shows the animated machine hero, with a call button
 * (first phone in site settings) and a jump to the form; with one it keeps the split layout.
 */
const ContactHero = ({ section, site }: SectionComponentProps<'contactHero'>) => {
  const t = useTranslations('sections');
  const { image, title, text } = section.props;

  if (!image) {
    const phone = site.contactWays.find((w) => w.type === 'phone');
    const tel = phone ? contactWayHref(phone) : null;
    return (
      <PageHero id={section.key} title={title} subtitle={text}>
        {tel && (
          <a href={tel} className={ctaClassName('primary', 'lg')}>
            <IconByName name="phone" className="size-4" />
            <span>{t('callNow')}</span>
          </a>
        )}
        <a href="#contact-ticket" className={ctaClassName('secondary', 'lg')}>
          <span>{t('sendMessage')}</span>
        </a>
      </PageHero>
    );
  }

  return (
    <section
      id={section.key}
      aria-labelledby={`${section.key}-title`}
      className="section-py relative overflow-hidden border-b border-line bg-canvas-subtle"
    >
      <Container size="wide">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-6">
            <span className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.2em] text-accent">
              <span className="h-px w-8 bg-accent" />
              Body Style
            </span>
            <h1 id={`${section.key}-title`} className="text-display">
              {title}
            </h1>
            <Paragraphs text={text} className="border-s-2 border-brand ps-5 text-lead" />
          </div>
          <div className="relative pb-5 pe-5">
            <div className="absolute inset-s-5 inset-e-0 bottom-0 top-5 border border-brand/50 bg-brand/10" />
            <SmartImage
              src={image}
              alt=""
              priority
              className="aspect-[4/3] border border-line-strong"
              imgClassName="saturate-[.8] contrast-110"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactHero;
