package com.playlists.app.service;
import com.playlists.app.model.CreateVideoRequest;
import com.playlists.app.model.Video;
import com.playlists.app.repository.VideoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.function.Consumer;

@Service
public class VideoService {
    private final VideoRepository repository;

    public VideoService(VideoRepository repository) {
        this.repository = repository;
    }

    public synchronized List<Video> list() {
        return repository.findAll();
    }

    public synchronized Video add(CreateVideoRequest req) {
        if (req.getYoutubeId() == null || req.getYoutubeId().isBlank()) {
            throw new IllegalArgumentException("youtubeId is required");
        }
        if (req.getTitle() == null || req.getTitle().isBlank()) {
            throw new IllegalArgumentException("title is required");
        }
        if (req.getUrl() == null || req.getUrl().isBlank()) {
            throw new IllegalArgumentException("url is required");
        }

        try {
            new URL(req.getUrl());
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("url is not a valid URL");
        }

        // Prevent duplicate youtubeId
        Optional<Video> existing = repository.findByYoutubeId(req.getYoutubeId());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("video with same youtubeId already exists");
        }

        Video v = new Video(req.getYoutubeId(), req.getTitle(), req.getChannelTitle(), req.getThumbnailUrl(), req.getUrl());

        int likes = 0;
        if (req.getLikes() != null && req.getLikes() >= 0) {
            likes = req.getLikes();
        }

        v.setLikes(likes);
        v.setUserLiked(Boolean.TRUE.equals(req.getUserLiked()));

        return repository.save(v);
    }

    public synchronized boolean delete(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    
    private synchronized Optional<Video> updateVideoProperty(Long id, Consumer<Video> updater) {
    Optional<Video> opt = repository.findById(id);
    opt.ifPresent(v -> {
        updater.accept(v);
        repository.save(v);
    });
    return opt;
}

    public synchronized Optional<Video> like(Long id) {
        return updateVideoProperty(id, v -> v.setUserLiked(!v.isUserLiked()));
    }

    public synchronized Optional<Video> toggleFavorite(Long id) {
        return updateVideoProperty(id, v -> v.setFavorite(!v.isFavorite()));
    } 
    


    

    public synchronized Optional<Video> findById(Long id) {
        return repository.findById(id);
    }

    public synchronized List<Video> listFavorites() {
        return repository.findByFavoriteTrue();
    }

    public synchronized List<Video> listLiked() {
        return repository.findByUserLikedTrue();
    }
}

