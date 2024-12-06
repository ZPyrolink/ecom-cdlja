package fr.cdlja.weebsport.service.dto;

public class PaymentDTO {

    private String cardNum;
    private int month;
    private int year;
    private String crypto;
    private OrderDTO basket;

    public String getCardNum() {
        return cardNum;
    }

    public int getMonth() {
        return month;
    }

    public int getYear() {
        return year;
    }

    public String getCrypto() {
        return crypto;
    }

    public OrderDTO getBasket() {
        return basket;
    }
}
