package com.playlists.app.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.playlists.app.model.Video;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

@Repository
public class FilePlaylistRepository {
    private final ObjectMapper mapper = new ObjectMapper();
    private final Path playlistPath;

    public FilePlaylistRepository() throws IOException {
        String fileName = "playlist.json";
        Path working = Path.of(System.getProperty("user.dir")).resolve(fileName);
        if (!Files.exists(working)) {
            // copy initial from classpath if available
            ClassPathResource resource = new ClassPathResource(fileName);
            if (resource.exists()) {
                try (InputStream is = resource.getInputStream()) {
                    Files.copy(is, working, StandardCopyOption.REPLACE_EXISTING);
                }
            } else {
                Files.writeString(working, "[]");
            }
        }
        this.playlistPath = working;
    }

    public synchronized List<Video> load() {
        try {
            byte[] bytes = Files.readAllBytes(playlistPath);
            if (bytes.length == 0) return new ArrayList<>();
            return mapper.readValue(bytes, new TypeReference<List<Video>>(){});
        } catch (IOException e) {
            return new ArrayList<>();
        }
    }

    public synchronized void save(List<Video> videos) {
        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(playlistPath.toFile(), videos);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
