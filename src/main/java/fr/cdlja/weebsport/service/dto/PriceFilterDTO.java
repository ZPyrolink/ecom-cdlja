package fr.cdlja.weebsport.service.dto;

public class PriceFilterDTO {

    private Float min;
    private Float max;

    public PriceFilterDTO(Float min, Float max) {
        this.min = min;
        this.max = max;
    }

    public Float getMin() {
        return min;
    }

    public void setMin(Float min) {
        this.min = min;
    }

    public Float getMax() {
        return max;
    }

    public void setMax(Float max) {
        this.max = max;
    }
}
