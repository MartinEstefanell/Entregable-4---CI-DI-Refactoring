import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  PlayCircle,
  Star,
  Trash2,
} from 'lucide-react';

export default function VideoList({
  heading = 'Mi lista',
  videos = [],
  onSelect,
  onRemove,
  onToggleFavorite,
  onToggleLike,
}) {
  if (!videos.length) {
    return (
      <section className="rounded-3xl border border-dashed border-white/30 p-10 text-center text-white/70">
        <p className="text-lg">Lista vacia</p>
      </section>
    );
  }

  return (
    <section className="w-full rounded-3xl border border-white/15 bg-white/5 py-12 backdrop-blur">
      <div className="px-6">
        <h2 className="text-3xl font-semibold text-white">{heading}</h2>
      </div>
      <div className="mt-6 flex flex-col">
        <AnimatePresence initial={false}>
          {videos.map((video, index) => (
            <motion.article
              key={video.id}
              className="grid items-center gap-4 border-t border-white/10 px-6 py-4 md:grid-cols-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="order-2 flex items-center gap-3 md:order-none">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="h-16 w-28 rounded-lg object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-sm uppercase tracking-[0.4em] text-brand/70">
                    {video.channelTitle}
                  </span>
                  <h3 className="text-white font-semibold">{video.title}</h3>
                </div>
              </div>
              <p className="order-1 text-sm text-white/70 md:order-none md:col-span-2">
                Likes:{' '}
                <span className="font-semibold">
                  {(video.likes ?? 0) + (video.userLiked ? 1 : 0)}
                </span>{' '}
                -{' '}
                {video.favorite
                  ? 'Favorito'
                  : video.userLiked
                    ? 'Con like'
                    : 'Normal'}
              </p>
              <div className="order-3 flex flex-wrap justify-end gap-2 md:order-none">
                <button
                  type="button"
                  onClick={() => onSelect?.(video)}
                  className="flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <PlayCircle size={16} />
                  Ver
                </button>
                <button
                  type="button"
                  onClick={() => onToggleFavorite?.(video)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    video.favorite
                      ? 'border-brand bg-brand/15 text-brand'
                      : 'border-white/30 text-white hover:bg-white/10'
                  }`}
                >
                  <Star size={16} />
                  {video.favorite ? 'Favorito' : 'Marcar favorito'}
                </button>
                {onToggleLike && video.userLiked && (
                  <button
                    type="button"
                    onClick={() => onToggleLike?.(video)}
                    className="flex items-center gap-2 rounded-full border border-brand/30 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand/10"
                  >
                    Quitar like
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemove?.(video)}
                  className="flex items-center gap-2 rounded-full border border-red-300/40 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10"
                >
                  <Trash2 size={16} />
                  Quitar
                </button>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
        <div className="px-6 pt-6 text-right">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.4em] text-white/60">
            Total {videos.length} videos
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </section>
  );
}
