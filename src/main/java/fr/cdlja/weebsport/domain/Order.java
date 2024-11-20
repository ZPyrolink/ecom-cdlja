package fr.cdlja.weebsport.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.cdlja.weebsport.domain.enumeration.MeansOfPayment;
import fr.cdlja.weebsport.domain.enumeration.Status;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Order.
 */
@Entity
@Table(name = "jhi_order")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Order implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "order_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "amount")
    private Float amount = 0F;

    @Enumerated(EnumType.STRING)
    @Column(name = "mean_of_payment")
    private MeansOfPayment meanOfPayment;

    // permet de récuperer le client qui à fait cette commande
    // à une fk vers le client car une commande est asso à un client
    @ManyToOne(fetch = FetchType.LAZY, targetEntity = SubscribedClients.class)
    @JoinColumn(name = "client_abonné_id")
    @JsonIgnoreProperties(value = { "basket", "favorises", "historiques" }, allowSetters = true)
    private AbstractClient client;

    // est composé de lignes de commande mais c orderline qui a la foreignkey
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "order")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "order", "stock" }, allowSetters = true)
    private Set<OrderLine> orderlines = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Order id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Status getStatus() {
        return this.status;
    }

    public Order status(Status status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Order date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Float getAmount() {
        return this.amount;
    }

    public Order amount(Float amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
    }

    public MeansOfPayment getMeanOfPayment() {
        return this.meanOfPayment;
    }

    public Order meanOfPayment(MeansOfPayment meanOfPayment) {
        this.setMeanOfPayment(meanOfPayment);
        return this;
    }

    public void setMeanOfPayment(MeansOfPayment meanOfPayment) {
        this.meanOfPayment = meanOfPayment;
    }

    public AbstractClient getClient() {
        return this.client;
    }

    public void setClient(AbstractClient client) {
        this.client = client;
    }

    public Order client(AbstractClient client) {
        this.setClient(client);
        return this;
    }

    public Set<OrderLine> getOrderlines() {
        return this.orderlines;
    }

    public void setOrderlines(Set<OrderLine> orderLines) {
        if (this.orderlines != null) {
            this.orderlines.forEach(i -> i.setOrder(null));
        }
        if (orderLines != null) {
            orderLines.forEach(i -> i.setOrder(this));
        }
        this.orderlines = orderLines;
    }

    public Order orderlines(Set<OrderLine> orderLines) {
        this.setOrderlines(orderLines);
        return this;
    }

    public Order addOrderline(OrderLine orderLine) {
        this.orderlines.add(orderLine);
        orderLine.setOrder(this);
        return this;
    }

    public Order removeOrderline(OrderLine orderLine) {
        this.orderlines.remove(orderLine);
        orderLine.setOrder(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Order)) {
            return false;
        }
        return getId() != null && getId().equals(((Order) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Order{" +
            "id=" + getId() +
            ", status='" + getStatus() + "'" +
            ", date='" + getDate() + "'" +
            ", amount=" + getAmount() +
            ", meanOfPayment='" + getMeanOfPayment() + "'" +
            "}";
    }
}
