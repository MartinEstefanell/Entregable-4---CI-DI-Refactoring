package com.playlists.app.controller;

import com.playlists.app.model.CreateVideoRequest;
import com.playlists.app.model.Video;
import com.playlists.app.service.VideoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/videos")
@CrossOrigin
public class VideoController {
    private final VideoService service;

    public VideoController(VideoService service) throws IOException {
        this.service = service;
    }

    @GetMapping
    public List<Video> list() {
        return service.list();
    }

    @GetMapping("/liked")
    public List<Video> listLiked() {
        return service.listLiked();
    }

    @GetMapping("/favorites")
    public List<Video> listFavorites() {
        return service.listFavorites();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Video> getOne(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Video> add(@RequestBody CreateVideoRequest payload) {
        try {
            Video created = service.add(payload);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean ok = service.delete(id);
        return ok ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Video> like(@PathVariable Long id) {
        return service.like(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<Video> favorite(@PathVariable Long id) {
        return service.toggleFavorite(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
