import Container from '@/shared/UI/Container';
import Paragraphs from '@/shared/UI/Paragraphs';
import SmartImage from '@/shared/UI/SmartImage';
import type { SectionComponentProps } from '../types';

/** Half-width image beside the title and text. */
const ContactHero = ({ section }: SectionComponentProps<'contactHero'>) => {
  const { image, title, text } = section.props;
  return (
    <section id={section.key} aria-labelledby={`${section.key}-title`} className="section-py-sm">
      <Container size="wide">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col gap-5">
            <h1 id={`${section.key}-title`} className="text-h1">
              {title}
            </h1>
            <Paragraphs text={text} className="text-lead" />
          </div>
          <SmartImage
            src={image}
            alt=""
            priority
            className="aspect-[4/3] rounded-xl border border-line"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </Container>
    </section>
  );
};

export default ContactHero;
