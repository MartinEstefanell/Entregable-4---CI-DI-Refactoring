import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { playlistApi } from '../services/apiClient.js';

const PlaylistContext = createContext(null);

export function PlaylistProvider({ children }) {
  const [playlist, setPlaylist] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  const loadPlaylist = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await playlistApi.listVideos();
      const normalized = Array.isArray(data)
        ? data.map((video) => ({
            ...video,
            likes:
              video.likes == null || Number.isNaN(Number(video.likes))
                ? 0
                : Number(video.likes),
            userLiked: Boolean(video.userLiked),
          }))
        : [];
      setPlaylist(normalized);
      setError(null);
    } catch (err) {
      console.error('Playlist load error', err);
      setError(err.message ?? 'No pudimos cargar tu playlist.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlaylist();
  }, [loadPlaylist]);

  useEffect(() => {
    const stored = sessionStorage.getItem('currentVideo');
    if (stored) {
      try {
        setCurrentVideo(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem('currentVideo');
      }
    }
  }, []);

  useEffect(() => {
    if (currentVideo) {
      sessionStorage.setItem('currentVideo', JSON.stringify(currentVideo));
    } else {
      sessionStorage.removeItem('currentVideo');
    }
  }, [currentVideo]);

  const selectVideo = useCallback((video) => {
    if (video) {
      setCurrentVideo(video);
    }
  }, []);

  const runSync = useCallback(async (action) => {
    setIsSyncing(true);
    try {
      const result = await action();
      setError(null);
      return result;
    } catch (err) {
      console.error('Playlist sync error', err);
      setError(err.message ?? 'Ocurrio un error con la playlist.');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const upsertVideo = useCallback((video) => {
    setPlaylist((prev) => {
      const exists = prev.some((item) => item.id === video.id);
      if (exists) {
        return prev.map((item) => (item.id === video.id ? video : item));
      }
      return [...prev, video];
    });
    setCurrentVideo((prev) => {
      if (!prev) {
        return prev;
      }

      if (prev?.id === video.id) {
        return video;
      }

      if (!prev?.id && prev.youtubeId && prev.youtubeId === video.youtubeId) {
        return video;
      }

      return prev;
    });
  }, []);

  const addToPlaylist = useCallback(
    async (video) =>
      runSync(async () => {
        const payload = {
          youtubeId: video.youtubeId,
          title: video.title,
          channelTitle: video.channelTitle,
          thumbnailUrl: video.thumbnailUrl,
          url: video.url,
          likes: video.likes ?? 0,
        };
        const created = await playlistApi.createVideo(payload);
        upsertVideo(created);
        return created;
      }),
    [runSync, upsertVideo],
  );

  const removeFromPlaylist = useCallback(
    async (id) =>
      runSync(async () => {
        await playlistApi.deleteVideo(id);
        setPlaylist((prev) => prev.filter((video) => video.id !== id));
        setCurrentVideo((prev) => (prev?.id === id ? null : prev));
      }),
    [runSync],
  );

  const likeVideo = useCallback(
    async (id) =>
      runSync(async () => {
        const updated = await playlistApi.likeVideo(id);

        setPlaylist((prev) =>
          prev.map((item) => {
            if (item.id !== id) return item;

            const prevLikes = item.likes ?? 0;
            const apiLikes = updated?.likes;
            const likes =
              apiLikes == null || Number.isNaN(Number(apiLikes))
                ? prevLikes
                : Number(apiLikes);

            const hasUserLikedField =
              updated &&
              Object.prototype.hasOwnProperty.call(updated, 'userLiked');
            const userLiked = hasUserLikedField
              ? Boolean(updated.userLiked)
              : !item.userLiked;

            return {
              ...item,
              ...(updated ?? {}),
              likes,
              userLiked,
            };
          }),
        );

        setCurrentVideo((prev) => {
          if (!prev || prev.id !== id) return prev;

          const prevLikes = prev.likes ?? 0;
          const apiLikes = updated?.likes;
          const likes =
            apiLikes == null || Number.isNaN(Number(apiLikes))
              ? prevLikes
              : Number(apiLikes);

          const hasUserLikedField =
            updated &&
            Object.prototype.hasOwnProperty.call(updated, 'userLiked');
          const userLiked = hasUserLikedField
            ? Boolean(updated.userLiked)
            : !prev.userLiked;

          return {
            ...prev,
            ...(updated ?? {}),
            likes,
            userLiked,
          };
        });

        return updated;
      }),
    [runSync],
  );

  const toggleFavorite = useCallback(
    async (id) =>
      runSync(async () => {
        const updated = await playlistApi.favoriteVideo(id);
        upsertVideo(updated);
        return updated;
      }),
    [runSync, upsertVideo],
  );

  const fetchVideoById = useCallback(async (id) => {
    try {
      const video = await playlistApi.getVideo(id);
      if (video) {
        upsertVideo(video);
        setCurrentVideo(video);
      }
      return video;
    } catch (err) {
      console.error('Fetch video error', err);
      setError(err.message ?? 'No encontramos ese video.');
      throw err;
    }
  }, [upsertVideo]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      playlist,
      currentVideo,
      isLoading,
      isSyncing,
      error,
      selectVideo,
      addToPlaylist,
      removeFromPlaylist,
      likeVideo,
      toggleFavorite,
      fetchVideoById,
      loadPlaylist,
      clearError,
    }),
    [
      playlist,
      currentVideo,
      isLoading,
      isSyncing,
      error,
      selectVideo,
      addToPlaylist,
      removeFromPlaylist,
      likeVideo,
      toggleFavorite,
      fetchVideoById,
      loadPlaylist,
      clearError,
    ],
  );

  return (
    <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>
  );
}

export function usePlaylist() {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist debe usarse dentro de PlaylistProvider');
  }
  return context;
}
