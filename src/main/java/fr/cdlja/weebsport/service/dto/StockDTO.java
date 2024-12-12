package fr.cdlja.weebsport.service.dto;

import fr.cdlja.weebsport.domain.Stock;
import fr.cdlja.weebsport.domain.enumeration.Color;
import fr.cdlja.weebsport.domain.enumeration.Size;

public class StockDTO {

    private Long id;
    private Color color;
    private Size size;
    private ClotheDTO clotheDTO;

    public StockDTO() {}

    public StockDTO(Stock stock) {
        this.id = stock.getId();
        this.color = stock.getColor();
        this.size = stock.getSize();
        this.clotheDTO = new ClotheDTO(stock.getClothe());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public ClotheDTO getClotheDTO() {
        return clotheDTO;
    }

    public void setClotheDTO(ClotheDTO clotheDTO) {
        this.clotheDTO = clotheDTO;
    }
}
