package fr.cdlja.weebsport.service.dto;

import fr.cdlja.weebsport.domain.Order;
import fr.cdlja.weebsport.domain.enumeration.MeansOfPayment;
import fr.cdlja.weebsport.domain.enumeration.Status;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class OrderDTO {

    private Long id;
    private Status status;
    private LocalDate date;
    private Float amount;
    private String deliveryAddress;
    private MeansOfPayment meansOfPayment;
    private String bankCard;
    private List<OrderlineDTO> lignescommandes;

    public OrderDTO() {}

    public OrderDTO(Order order) {
        this.id = order.getId();
        this.status = order.getStatus();
        this.date = order.getDate();
        this.amount = order.getAmount();
        this.deliveryAddress = order.getDeliveryAddress();
        this.meansOfPayment = order.getMeanOfPayment();
        this.lignescommandes = new ArrayList<>();
        this.bankCard = "nonenregistré";
    }

    public String getBankCard() {
        return bankCard;
    }

    public void setBankCard(String bankCard) {
        this.bankCard = bankCard;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Float getAmount() {
        return amount;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public MeansOfPayment getMeansOfPayment() {
        return meansOfPayment;
    }

    public void setMeansOfPayment(MeansOfPayment meansOfPayment) {
        this.meansOfPayment = meansOfPayment;
    }

    public List<OrderlineDTO> getOrderLines() {
        return lignescommandes;
    }

    public void setArticles(List<OrderlineDTO> articles) {
        this.lignescommandes = articles;
    }

    public void addArticle(OrderlineDTO article) {
        this.lignescommandes.add(article);
    }
}
