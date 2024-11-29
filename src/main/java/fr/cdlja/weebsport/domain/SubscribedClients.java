package fr.cdlja.weebsport.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SubscribedClients.
 */
@Entity
@Table(name = "subscribed_clients")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SubscribedClients extends AbstractClient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "subscribedClientSequenceGenerator")
    @SequenceGenerator(name = "subscribedClientSequenceGenerator", sequenceName = "client_id_seq")
    @Column(name = "id")
    private Long id;

    @Column(name = "birthday")
    private LocalDate birthday;

    @Column(name = "bank_card")
    private String bankCard = "nonenregistre";

    @Column(name = "phone")
    private String phone;

    @Column(name = "points")
    private Integer points = 0;

    @JsonIgnoreProperties(value = { "client", "orderlines", "subscribedClients" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(unique = true, name = "basket_id")
    private Order basket;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "favoris",
        joinColumns = @JoinColumn(name = "subscribed_clients_id"),
        inverseJoinColumns = @JoinColumn(name = "clothe_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "subscribedClients" }, allowSetters = true)
    private Set<Clothe> favorises = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "client", "orderlines", "subscribedClients" }, allowSetters = true)
    private Set<Order> historiques = new HashSet<>();

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SubscribedClients id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String gettypeClient() {
        return "Abonné";
    }

    public LocalDate getBirthday() {
        return this.birthday;
    }

    public SubscribedClients birthday(LocalDate birthday) {
        this.setBirthday(birthday);
        return this;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    public SubscribedClients email(String email) {
        this.setEmail(email);
        return this;
    }

    public SubscribedClients address(String address) {
        this.setAddress(address);
        return this;
    }

    public String getBankCard() {
        return this.bankCard;
    }

    public SubscribedClients bankCard(String bankCard) {
        this.setBankCard(bankCard);
        return this;
    }

    public void setBankCard(String bankCard) {
        this.bankCard = bankCard;
    }

    public String getPhone() {
        return this.phone;
    }

    public SubscribedClients phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getPoints() {
        return this.points;
    }

    public SubscribedClients points(Integer points) {
        this.setPoints(points);
        return this;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public Order getBasket() {
        return this.basket;
    }

    public void setBasket(Order order) {
        this.basket = order;
        if (basket != null) {
            basket.setClient(this); // Synchronisation du côté Commande
        }
    }

    public SubscribedClients basket(Order order) {
        this.setBasket(order);
        return this;
    }

    public Set<Clothe> getFavorises() {
        return this.favorises;
    }

    public void setFavorises(Set<Clothe> clothes) {
        this.favorises = clothes;
    }

    public SubscribedClients favorises(Set<Clothe> clothes) {
        this.setFavorises(clothes);
        return this;
    }

    public SubscribedClients addFavoris(Clothe clothe) {
        this.favorises.add(clothe);
        return this;
    }

    public SubscribedClients removeFavoris(Clothe clothe) {
        this.favorises.remove(clothe);
        return this;
    }

    public Set<Order> getHistoriques() {
        return this.historiques;
    }

    public void setHistoriques(Set<Order> orders) {
        if (this.historiques != null) {
            this.historiques.forEach(i -> i.setClient(null));
        }
        if (orders != null) {
            orders.forEach(i -> i.setClient(this));
        }
        this.historiques = orders;
    }

    public SubscribedClients historiques(Set<Order> orders) {
        this.setHistoriques(orders);
        return this;
    }

    public SubscribedClients addHistorique(Order order) {
        this.historiques.add(order);
        order.setClient(this);
        return this;
    }

    public SubscribedClients removeHistorique(Order order) {
        this.historiques.remove(order);
        order.setClient(null);
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getUser() {
        return this.user;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SubscribedClients)) {
            return false;
        }
        return getId() != null && getId().equals(((SubscribedClients) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SubscribedClients{" +
            "id=" + getId() +
            ", lastname='" + user.getLastName() + "'" +
            ", firstname='" + user.getFirstName() + "'" +
            ", birthday='" + getBirthday() + "'" +
            ", email='" + getEmail() + "'" +
            ", passworld_cripted='" + user.getPassword() + "'" +
            ", address='" + getAddress() + "'" +
            ", bankCard='" + getBankCard() + "'" +
            ", phone='" + getPhone() + "'" +
            ", points=" + getPoints() +
            ", basket=" + getBasket() +
            ", favorises=" + getFavorises() +
            ", historiques=" + getHistoriques() +
            "}";
    }
}
