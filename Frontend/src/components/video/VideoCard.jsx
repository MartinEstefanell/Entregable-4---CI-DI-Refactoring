import { motion } from 'framer-motion';
import { Heart, Plus, Star } from 'lucide-react';

export default function VideoCard({
  video,
  onSelect,
  onAdd,
  isSaved,
  isFavorite,
  disabled = false,
}) {
  const handleSelect = () => {
    onSelect?.(video);
  };

  return (
    <motion.div
      layout
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur"
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <button
        type="button"
        onClick={handleSelect}
        className="aspect-video w-full overflow-hidden"
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </button>
      <div className="flex flex-1 flex-col gap-3 px-5 py-4 text-left text-white">
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.4em] text-brand/70">
            {video.channelTitle}
          </p>
          <h3 className="text-lg font-semibold leading-tight">{video.title}</h3>
        </div>
        <div className="mt-auto flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSelect}
            className="flex flex-1 items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Ver
          </button>
          <button
            type="button"
            onClick={() => onAdd?.(video)}
            disabled={isSaved || disabled}
            className="flex items-center gap-2 rounded-full border border-brand/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand transition hover:border-brand hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={16} />
            {isSaved ? 'En mi lista' : disabled ? 'Guardando...' : 'Agregar'}
          </button>
          {isFavorite && (
            <span className="flex items-center gap-1 rounded-full bg-brand/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-brand">
              <Star size={14} />
              Favorito
            </span>
          )}
        </div>
      </div>
      {isSaved && (
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs uppercase tracking-wide text-white">
          <Heart size={14} className="fill-brand text-brand" />
          Guardado
        </div>
      )}
    </motion.div>
  );
}
