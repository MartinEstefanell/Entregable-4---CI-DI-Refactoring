import Layout from '../components/layout/Layout.jsx';
import VideoList from '../components/video/VideoList.jsx';
import { usePlaylist } from '../context/PlaylistContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function MyListPage() {
  const navigate = useNavigate();
  const {
    playlist,
    isLoading,
    removeFromPlaylist,
    toggleFavorite,
    selectVideo,
    likeVideo,
  } = usePlaylist();

  const savedVideos = playlist.filter(
    (video) => !video.userLiked && !video.favorite,
  );
  const likedVideos = playlist.filter((video) => video.userLiked);
  const favoriteVideos = playlist.filter((video) => video.favorite);

  const handleSelect = (video) => {
    selectVideo(video);
    navigate('/viewer');
  };

  const handleRemove = async (video) => {
    await removeFromPlaylist(video.id);
  };

  const handleToggleFavorite = async (video) => {
    await toggleFavorite(video.id);
  };

  const handleToggleLike = async (video) => {
    await likeVideo(video.id);
  };

  return (
    <Layout>
      <div className="space-y-8 text-white">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.6em] text-brand/70">
            Paso 3
          </p>
          <h1 className="text-4xl font-semibold">Mi lista</h1>
        </header>

        {isLoading ? (
          <div className="rounded-3xl border border-white/20 p-8 text-center text-white/70">
            Cargando playlist...
          </div>
        ) : (
          <div className="space-y-8">
            <VideoList
              heading="Tus videos guardados"
              videos={savedVideos}
              onSelect={handleSelect}
              onRemove={handleRemove}
              onToggleFavorite={handleToggleFavorite}
            />
            <VideoList
              heading="Videos que te gustaron"
              videos={likedVideos}
              onSelect={handleSelect}
              onRemove={handleRemove}
              onToggleFavorite={handleToggleFavorite}
              onToggleLike={handleToggleLike}
            />
            <VideoList
              heading="Favoritos"
              videos={favoriteVideos}
              onSelect={handleSelect}
              onRemove={handleRemove}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
