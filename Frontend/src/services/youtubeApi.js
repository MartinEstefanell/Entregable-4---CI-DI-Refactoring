const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY ?? '';
const YOUTUBE_SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_VIDEOS_ENDPOINT = 'https://www.googleapis.com/youtube/v3/videos';

function ensureApiKey() {
  if (!API_KEY) {
    throw new Error('Falta configurar la clave de la API de YouTube.');
  }
}

function mapYoutubeItem(item, idField = 'videoId', likesById) {
  const rawId = item.id;
  const youtubeId =
    typeof rawId === 'string' ? rawId : rawId?.[idField] ?? rawId?.videoId;

  const { title, channelTitle, thumbnails, description } = item.snippet;
  const rawLikes = likesById?.[youtubeId] ?? item.statistics?.likeCount;
  const likes =
    rawLikes == null || Number.isNaN(Number(rawLikes))
      ? 0
      : Number(rawLikes);

  return {
    youtubeId,
    title,
    channelTitle,
    description,
    thumbnailUrl:
      thumbnails?.high?.url ??
      thumbnails?.medium?.url ??
      thumbnails?.default?.url ??
      '',
    url: `https://www.youtube.com/watch?v=${youtubeId}`,
    likes,
  };
}

export async function searchVideos(query) {
  if (!query?.trim()) {
    return [];
  }

  ensureApiKey();

  const params = new URLSearchParams({
    key: API_KEY,
    part: 'snippet',
    type: 'video',
    maxResults: '12',
    q: query.trim(),
  });

  const response = await fetch(`${YOUTUBE_SEARCH_ENDPOINT}?${params.toString()}`);
  const payload = await response.json();

  if (!response.ok) {
    const message =
      payload?.error?.message ?? 'No pudimos buscar videos en YouTube.';
    throw new Error(message);
  }

  const items = payload.items ?? [];
  if (!items.length) {
    return [];
  }

  const ids = items
    .map((item) => item.id?.videoId)
    .filter(Boolean);

  let likesById = {};
  if (ids.length) {
    try {
      const statsParams = new URLSearchParams({
        key: API_KEY,
        part: 'statistics',
        id: ids.join(','),
      });
      const statsResponse = await fetch(
        `${YOUTUBE_VIDEOS_ENDPOINT}?${statsParams.toString()}`,
      );
      const statsPayload = await statsResponse.json();
      if (statsResponse.ok) {
        likesById = (statsPayload.items ?? []).reduce((acc, item) => {
          const id = item.id;
          const likeCount = item.statistics?.likeCount ?? 0;
          if (id) {
            acc[id] = likeCount;
          }
          return acc;
        }, {});
      }
    } catch {
      likesById = {};
    }
  }

  return items.map((item) => mapYoutubeItem(item, 'videoId', likesById));
}

export async function getRecommendedVideos() {
  ensureApiKey();

  const params = new URLSearchParams({
    key: API_KEY,
    part: 'snippet,statistics',
    chart: 'mostPopular',
    maxResults: '12',
    regionCode: 'AR',
  });

  const response = await fetch(`${YOUTUBE_VIDEOS_ENDPOINT}?${params.toString()}`);
  const payload = await response.json();

  if (!response.ok) {
    const message =
      payload?.error?.message ?? 'No pudimos cargar videos recomendados.';
    throw new Error(message);
  }

  return (payload.items ?? []).map((item) => mapYoutubeItem(item, 'id'));
}
