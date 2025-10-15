import { memo, type FC } from 'react';
interface YouTubeProps {
  readonly id?: string;
  readonly url?: string;
  readonly title?: string;
}

const YouTubeComponent: FC<YouTubeProps> = ({ id, url, title = 'YouTube video' }) => {
  const videoId = id ?? (url ? (new URL(url).searchParams.get('v') ?? '') : '');
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;

  return (
    <>
      <div className="yt-embed">
        <iframe
          src={src}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .yt-embed { 
            position: relative; 
            width: 100%; 
            aspect-ratio: 16 / 9; 
          }
          .yt-embed iframe { 
            position: absolute; 
            inset: 0; 
            width: 100%; 
            height: 100%; 
            border: 0; 
            border-radius: 0.75rem; 
          }
        `,
        }}
      />
    </>
  );
};

const YouTube = memo(YouTubeComponent);
YouTube.displayName = 'YouTube';

export default YouTube;
export { YouTube };
