import clsx from 'clsx';
import React from 'react';

export type ContainerSize = 'content' | 'wide' | 'tv';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  as?: 'div' | 'section' | 'article' | 'nav' | 'header' | 'footer';
}

const SIZE_CLASS: Record<ContainerSize, string> = {
  content: 'container-content',
  wide: 'container-wide',
  tv: 'container-tv',
};

/** Horizontal page container with responsive gutters. `wide` for grids, `content` for text. */
const Container = ({ size = 'wide', as: Tag = 'div', className, ...rest }: ContainerProps) => (
  <Tag className={clsx(SIZE_CLASS[size], className)} {...rest} />
);

export default Container;
