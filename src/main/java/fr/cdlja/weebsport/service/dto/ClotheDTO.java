package fr.cdlja.weebsport.service.dto;

import fr.cdlja.weebsport.domain.Clothe;
import fr.cdlja.weebsport.domain.enumeration.Type;

public class ClotheDTO {

    private Long id;
    private Type type;

    public ClotheDTO() {}

    public ClotheDTO(Clothe clothe) {
        this.id = clothe.getId();
        this.type = clothe.getType();
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
}
