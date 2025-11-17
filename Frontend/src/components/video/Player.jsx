export default function Player({ youtubeId }) {
  if (!youtubeId) {
    return (
    <div className="flex aspect-video w-full items-center justify-center rounded-3xl border border-dashed border-white/30 bg-black/30 text-white/70">
      Selecciona un video para reproducirlo.
    </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title="YouTube player"
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
