package com.playlists.app.repository;

import com.playlists.app.model.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
	java.util.Optional<Video> findByYoutubeId(String youtubeId);
	java.util.List<Video> findByFavoriteTrue();
	java.util.List<Video> findByLikesGreaterThan(int likes);
	java.util.List<Video> findByUserLikedTrue();
}
