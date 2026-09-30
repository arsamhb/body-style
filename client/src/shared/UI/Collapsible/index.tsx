'use client';
import React, { ReactNode } from 'react';

interface CollapsibleProps {
  children: ReactNode;
  header: ReactNode;
  headerClassName?: string;
  bodyClassName?: string;
}

const Collapsible: React.FC<CollapsibleProps> = ({
  children,
  header,
  headerClassName,
  bodyClassName,
}) => {
  return (
    <section className={`w-full flex flex-col gap-2 ${bodyClassName}`}>
      <details tabIndex={0} className="collapse collapse-arrow border-base-300 bg-base-300 border">
        <summary className={`collapse-title text-xl font-medium ${headerClassName}`}>
          {header}
        </summary>
        <div className="collapse-content">{children}</div>
      </details>
    </section>
  );
};

export default Collapsible;
