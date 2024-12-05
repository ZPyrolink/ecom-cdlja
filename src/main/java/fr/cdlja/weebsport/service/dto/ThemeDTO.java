package fr.cdlja.weebsport.service.dto;

import java.util.List;

public class ThemeDTO {

    private List<String> animeThemes;
    private List<String> videogameThemes;

    public ThemeDTO() {}

    public List<String> getAnimeThemes() {
        return animeThemes;
    }

    public void setAnimeThemes(List<String> animeThemes) {
        this.animeThemes = animeThemes;
    }

    public List<String> getVideogameThemes() {
        return videogameThemes;
    }

    public void setVideogameThemes(List<String> videogameThemes) {
        this.videogameThemes = videogameThemes;
    }

    public void addAnimeTheme(String animeTheme) {
        this.animeThemes.add(animeTheme);
    }

    public void addVideogameTheme(String videogameTheme) {
        this.videogameThemes.add(videogameTheme);
    }
}
