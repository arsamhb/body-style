import clsx from 'clsx';

interface ParagraphsProps {
  text: string;
  className?: string;
}

/**
 * Renders plain multi-line text as paragraphs. Content is stored as plain strings (no HTML), so
 * there is nothing to sanitise: React escapes everything.
 */
const Paragraphs = ({ text, className }: ParagraphsProps) => {
  const blocks = text
    .split(/\n{2,}|\r\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  if (blocks.length === 0) return null;
  return (
    <div className={clsx('prose-plain', className)}>
      {blocks.map((block, i) => (
        <p key={i}>
          {block.split(/\r?\n/).map((line, j, arr) => (
            <span key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
};

export default Paragraphs;
