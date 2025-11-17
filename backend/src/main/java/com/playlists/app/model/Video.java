package com.playlists.app.model;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "videos")
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "youtube_id")
    private String youtubeId;

    private String title;

    @Column(name = "channel_title")
    private String channelTitle;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    private String url;

    private int likes;

    private boolean favorite;

    @Column(name = "user_liked")
    private boolean userLiked;

    public Video() {
    }

    public Video(String youtubeId, String title, String channelTitle, String thumbnailUrl, String url) {
        this.youtubeId = youtubeId;
        this.title = title;
        this.channelTitle = channelTitle;
        this.thumbnailUrl = thumbnailUrl;
        this.url = url;
        this.likes = 0;
        this.favorite = false;
        this.userLiked = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getYoutubeId() {
        return youtubeId;
    }

    public void setYoutubeId(String youtubeId) {
        this.youtubeId = youtubeId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getChannelTitle() {
        return channelTitle;
    }

    public void setChannelTitle(String channelTitle) {
        this.channelTitle = channelTitle;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public boolean isFavorite() {
        return favorite;
    }

    public void setFavorite(boolean favorite) {
        this.favorite = favorite;
    }

    public boolean isUserLiked() {
        return userLiked;
    }

    public void setUserLiked(boolean userLiked) {
        this.userLiked = userLiked;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Video video = (Video) o;
        return Objects.equals(id, video.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

