package fr.cdlja.weebsport.service.dto;

import fr.cdlja.weebsport.domain.OrderLine;

public class OrderlineDTO {

    private Long id;
    private Integer quantity;
    private Float amountline;
    private StockDTO stockDTO;

    public OrderlineDTO() {}

    public OrderlineDTO(OrderLine o) {
        this.id = o.getId();
        this.quantity = o.getQuantity();
        this.amountline = o.getAmountline();
        this.stockDTO = new StockDTO(o.getStock());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Float getAmountline() {
        return amountline;
    }

    public void setAmountline(Float amountline) {
        this.amountline = amountline;
    }

    public StockDTO getStockDTO() {
        return stockDTO;
    }

    public void setStockDTO(StockDTO stockDTO) {
        this.stockDTO = stockDTO;
    }
}
