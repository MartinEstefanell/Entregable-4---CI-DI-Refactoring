import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout.jsx';
import SearchBar from '../components/search/SearchBar.jsx';
import VideoCard from '../components/video/VideoCard.jsx';
import { getRecommendedVideos, searchVideos } from '../services/youtubeApi.js';
import { usePlaylist } from '../context/PlaylistContext.jsx';

export default function MainPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const {
    playlist,
    selectVideo,
    addToPlaylist,
    isSyncing,
    error,
    clearError,
  } = usePlaylist();

  const playlistErrorToShow =
    error && error.toLowerCase() !== 'failed to fetch' ? error : '';

  const handleSearch = useCallback(async (query) => {
    setHasSearched(true);
    setIsSearching(true);
    setSearchError('');
    try {
      const data = await searchVideos(query);
      setResults(data);
    } catch (err) {
      console.error('YouTube search error', err);
      setSearchError(err.message ?? 'No se pudieron traer resultados.');
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const loadRecommended = async () => {
      setIsSearching(true);
      setSearchError('');
      try {
        const data = await getRecommendedVideos();
        setResults(data);
      } catch (err) {
        console.error('YouTube recommendations error', err);
        setSearchError(
          err.message ?? 'No pudimos cargar videos recomendados.',
        );
      } finally {
        setIsSearching(false);
      }
    };

    loadRecommended();
  }, []);

  const handleWatch = (video) => {
    selectVideo(video);
    navigate('/viewer');
  };

  const handleAdd = async (video) => {
    try {
      await addToPlaylist(video);
    } catch {
      /* el contexto se encarga de exponer el error */
    }
  };

  const savedById = playlist.reduce((acc, video) => {
    acc[video.youtubeId] = video;
    return acc;
  }, {});

  return (
    <Layout>
      <div className="space-y-8 text-white">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.6em] text-brand/70">
            Paso 1
          </p>
          <h1 className="text-4xl font-semibold">Descubri nuevos videos</h1>
          <p className="text-white/70">
            Busca en YouTube sin salir de la app y agrega los resultados a tu
            lista persistida en H2.
          </p>
        </header>

        <SearchBar onSearch={handleSearch} isLoading={isSearching} />

        {searchError && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {searchError}
          </div>
        )}

        {playlistErrorToShow && (
          <div className="flex items-center justify-between rounded-2xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">
            <span>{playlistErrorToShow}</span>
            <button
              type="button"
              onClick={clearError}
              className="text-xs uppercase tracking-[0.3em]"
            >
              Cerrar
            </button>
          </div>
        )}

        <section className="grid gap-6 md:grid-cols-2">
          {results.map((video) => (
            <VideoCard
              key={video.youtubeId}
              video={video}
              onSelect={handleWatch}
              onAdd={handleAdd}
              isSaved={Boolean(savedById[video.youtubeId])}
              isFavorite={savedById[video.youtubeId]?.favorite}
              disabled={isSyncing}
            />
          ))}
        </section>

        {!results.length && !isSearching && (
          <div className="rounded-3xl border border-dashed border-white/30 p-10 text-center text-white/60">
            {hasSearched
              ? 'No encontramos resultados para tu búsqueda.'
              : 'No hay videos para mostrar en este momento.'}
          </div>
        )}
      </div>
    </Layout>
  );
}
