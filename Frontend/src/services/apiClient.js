const DEFAULT_BASE_URL = 'http://localhost:8080/api';

const sanitizedBaseUrl =
  (import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? DEFAULT_BASE_URL);

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  };

  const response = await fetch(`${sanitizedBaseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const data = await response.json();
      if (data?.message) {
        message = data.message;
      }
    } catch {
      const text = await response.text();
      if (text) {
        message = text;
      }
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const playlistApi = {
  listVideos: () => request('/videos'),
  getVideo: (id) => request(`/videos/${id}`),
  createVideo: (payload) =>
    request('/videos', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  deleteVideo: (id) =>
    request(`/videos/${id}`, {
      method: 'DELETE',
    }),
  likeVideo: (id) =>
    request(`/videos/${id}/like`, {
      method: 'POST',
    }),
  favoriteVideo: (id) =>
    request(`/videos/${id}/favorite`, {
      method: 'POST',
    }),
};
