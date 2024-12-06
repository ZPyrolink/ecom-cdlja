package fr.cdlja.weebsport.service.dto;

import fr.cdlja.weebsport.domain.Clothe;
import fr.cdlja.weebsport.domain.enumeration.Type;

public class ClotheDTO {

    private Long id;
    private Type type;
    private String theme;
    private float price;
    private String description;

    public ClotheDTO() {}

    public ClotheDTO(Clothe clothe) {
        this.id = clothe.getId();
        this.type = clothe.getType();
        this.theme = clothe.getTheme();
        this.price = clothe.getPrice();
        this.description = clothe.getDescription();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public String getTheme() {
        return this.theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public float getPrice() {
        return this.price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
