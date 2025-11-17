import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, Loader2, Star, Youtube } from 'lucide-react';
import Layout from '../components/layout/Layout.jsx';
import Player from '../components/video/Player.jsx';
import { usePlaylist } from '../context/PlaylistContext.jsx';

export default function ViewerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentVideo,
    playlist,
    selectVideo,
    addToPlaylist,
    likeVideo,
    toggleFavorite,
    fetchVideoById,
    isSyncing,
  } = usePlaylist();
  const [localStatus, setLocalStatus] = useState({
    loading: false,
    error: '',
  });

  const selectedVideo = useMemo(() => {
    if (currentVideo) {
      return currentVideo;
    }
    if (id) {
      return playlist.find((video) => String(video.id) === String(id));
    }
    return null;
  }, [currentVideo, playlist, id]);

  useEffect(() => {
    if (!id) {
      return;
    }
    if (selectedVideo) {
      return;
    }

    setLocalStatus({ loading: true, error: '' });
    fetchVideoById(id)
      .catch((err) =>
        setLocalStatus({ loading: false, error: err.message }),
      )
      .finally(() =>
        setLocalStatus((prev) => ({ ...prev, loading: false })),
      );
  }, [id, selectedVideo, fetchVideoById]);

  const handleLike = async () => {
    if (!selectedVideo) return;

    // Si el video no esta aun en H2, lo agregamos primero
    if (!selectedVideo.id) {
      try {
        const created = await addToPlaylist(selectedVideo);
        selectVideo(created);
        await likeVideo(created.id);
      } catch {
        // El contexto ya maneja errores globales
      }
      return;
    }

    try {
      await likeVideo(selectedVideo.id);
    } catch {
      // El contexto ya maneja errores globales
    }
  };

  const handleFavorite = async () => {
    if (!selectedVideo) return;

    if (!selectedVideo.id) {
      try {
        const created = await addToPlaylist(selectedVideo);
        selectVideo(created);
        await toggleFavorite(created.id);
      } catch {
        /* El contexto maneja errores */
      }
      return;
    }

    await toggleFavorite(selectedVideo.id);
  };

  const handleYoutubeLink = () => {
    if (selectedVideo?.url) {
      window.open(selectedVideo.url, '_blank', 'noopener');
    }
  };

  return (
    <Layout>
      <div className="space-y-8 text-white">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.6em] text-brand/70">
            Paso 2
          </p>
          <h1 className="text-4xl font-semibold">Visualizador</h1>
          <p className="text-white/70">
            Mira tus videos guardados y reacciona con likes o favoritos.
          </p>
        </header>

        {localStatus.error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {localStatus.error}
          </div>
        )}

        <Player youtubeId={selectedVideo?.youtubeId} />

        {localStatus.loading && (
          <div className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/70">
            <Loader2 className="animate-spin" size={16} />
            Cargando video...
          </div>
        )}

        {selectedVideo ? (
          <section className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.5em] text-brand/70">
                  {selectedVideo.channelTitle}
                </p>
                <h2 className="text-3xl font-semibold">{selectedVideo.title}</h2>
                <p className="text-white/60">
                  Likes:{' '}
                  <span className="font-semibold">
                    {(selectedVideo.likes ?? 0) +
                      (selectedVideo.userLiked ? 1 : 0)}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleLike}
                  className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition ${
                    selectedVideo.userLiked
                      ? 'border-brand bg-brand/15 text-brand'
                      : 'border-white/30 text-white hover:bg-white/10'
                  }`}
                >
                  <Heart className="text-brand" size={16} />
                  Like
                </button>
                <button
                  type="button"
                  onClick={handleFavorite}
                  disabled={isSyncing}
                  className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    selectedVideo.favorite
                      ? 'border-brand bg-brand/15 text-brand'
                      : 'border-white/30 text-white hover:bg-white/10'
                  }`}
                >
                  <Star size={16} />
                  {selectedVideo.favorite ? 'Favorito' : 'Marcar favorito'}
                </button>
                <button
                  type="button"
                  onClick={handleYoutubeLink}
                  className="flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <Youtube size={16} />
                  Ver en YouTube
                </button>
              </div>
            </div>
          </section>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/30 p-8 text-white/70">
            Elegi un video desde Main Page o tu lista.
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/main')}
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Volver al buscador
          </button>
          <button
            type="button"
            onClick={() => navigate('/my-list')}
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-emerald-300"
          >
            Ir a mi lista
          </button>
        </div>
      </div>
    </Layout>
  );
}
