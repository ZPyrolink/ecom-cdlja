package fr.cdlja.weebsport.service.dto;

import fr.cdlja.weebsport.domain.enumeration.Color;
import fr.cdlja.weebsport.domain.enumeration.Gender;
import fr.cdlja.weebsport.domain.enumeration.Size;
import java.util.List;

public class FilterDTO {

    private List<Size> sizes;
    private List<Color> colors;
    private PriceFilterDTO prices;
    private List<Gender> genders;
    private List<String> videogameThemes;
    private List<String> animeThemes;

    public List<Size> getSizes() {
        return sizes;
    }

    public void setSizes(List<Size> sizes) {
        this.sizes = sizes;
    }

    public List<Color> getColors() {
        return colors;
    }

    public void setColors(List<Color> colors) {
        this.colors = colors;
    }

    public PriceFilterDTO getPrices() {
        return prices;
    }

    public void setPrices(PriceFilterDTO prices) {
        this.prices = prices;
    }

    public void setGenders(List<Gender> genders) {
        this.genders = genders;
    }

    public List<Gender> getGenders() {
        return this.genders;
    }

    public List<String> getVideogameThemes() {
        return videogameThemes;
    }

    public void setVideogameThemes(List<String> videogameThemes) {
        this.videogameThemes = videogameThemes;
    }

    public List<String> getAnimeThemes() {
        return animeThemes;
    }

    public void setAnimeThemes(List<String> animeThemes) {
        this.animeThemes = animeThemes;
    }
}
