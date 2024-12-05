package fr.cdlja.weebsport.service.dto;

import fr.cdlja.weebsport.domain.Order;
import fr.cdlja.weebsport.domain.enumeration.MeansOfPayment;
import fr.cdlja.weebsport.domain.enumeration.Status;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class OrderDTO {

    private Long id;
    private Status status;
    private LocalDate date;
    private Float amount;
    private String deliveryAddress;
    private MeansOfPayment meansOfPayment;
    private String bankCard;
    private List<OrderlineDTO> orderLines;
    private int totalElements;
    private int totalPages;
    //page courante
    private int number;
    //taille de la page
    private int size;
    private boolean first;
    private boolean last;

    public OrderDTO() {}

    public OrderDTO(Order order) {
        this.id = order.getId();
        this.status = order.getStatus();
        this.date = order.getDate();
        this.amount = order.getAmount();
        this.deliveryAddress = order.getDeliveryAddress();
        this.meansOfPayment = order.getMeanOfPayment();
        this.orderLines = new ArrayList<>();
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
        return orderLines;
    }

    public void setArticles(List<OrderlineDTO> articles) {
        this.orderLines = articles;
    }

    public void addArticle(OrderlineDTO article) {
        this.orderLines.add(article);
    }

    public int getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(int totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public boolean isFirst() {
        return first;
    }

    public void setFirst(boolean first) {
        this.first = first;
    }

    public boolean isLast() {
        return last;
    }

    public void setLast(boolean last) {
        this.last = last;
    }
}
