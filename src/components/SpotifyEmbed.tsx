type SpotifyEmbedProps = {
  src: string;
  height?: number | string;
  responsive?: boolean;
  mobileHeight?: number | string;
  desktopHeight?: number | string;
  title?: string;
  className?: string;
};

export default function SpotifyEmbed({
  src,
  height = 352,
  responsive = false,
  mobileHeight = 200,
  desktopHeight = 352,
  title = "Spotify Player",
  className = "",
}: SpotifyEmbedProps) {
  if (responsive) {
    return (
      <div className={`w-full ${className}`}>
        {/* Mobile */}
        <iframe
          style={{ borderRadius: 12 }}
          src={src}
          width="100%"
          height={typeof mobileHeight === "number" ? mobileHeight : mobileHeight}
          frameBorder={"0"}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={title}
          className="block md:hidden"
          allowFullScreen
        />
        {/* Desktop */}
        <iframe
          style={{ borderRadius: 12 }}
          src={src}
          width="100%"
          height={typeof desktopHeight === "number" ? desktopHeight : desktopHeight}
          frameBorder={"0"}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={title}
          className="hidden md:block"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <iframe
        style={{ borderRadius: 12 }}
        src={src}
        width="100%"
        height={typeof height === "number" ? height : height}
        frameBorder={"0"}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title={title}
        allowFullScreen
      />
    </div>
  );
}
