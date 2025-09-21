import React, { type ReactNode, memo } from 'react';

interface FigureProps {
  readonly src: string | { src: string };
  readonly alt?: string;
  readonly caption?: string;
  readonly children?: ReactNode;
}

const FigureComponent: React.FC<FigureProps> = ({ src, alt = '', caption, children }) => {
  // Handle both string sources and Astro image objects
  const imageSrc = typeof src === 'string' ? src : src.src;
  
  return (
    <>
      <figure className="mdx-figure">
        <img src={imageSrc} alt={alt} loading="lazy" decoding="async" />
        {caption && <figcaption>{caption}</figcaption>}
        {children}
      </figure>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .mdx-figure { 
            margin: 1.5rem 0; 
          }
          .mdx-figure img { 
            width: 100%; 
            height: auto; 
            border-radius: 0.75rem; 
          }
          .mdx-figure figcaption { 
            margin-top: 0.5rem; 
            color: rgb(148 163 184); 
            font-size: 0.9rem; 
            text-align: center; 
          }
        `
      }} />
    </>
  );
};

const Figure = memo(FigureComponent);
Figure.displayName = 'Figure';

export default Figure;
export { Figure };