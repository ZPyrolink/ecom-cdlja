package fr.cdlja.weebsport.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
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
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "birthday")
    private LocalDate birthday;

    @Column(name = "passworld")
    private String passworld;

    @Column(name = "banck_card")
    private String banckCard;

    @Column(name = "phone")
    private String phone;

    @Column(name = "points")
    private Integer points;

    @JsonIgnoreProperties(value = { "client", "orderlines", "subscribedClients" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
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

    public SubscribedClients lastname(String lastname) {
        this.setLastname(lastname);
        return this;
    }

    public SubscribedClients firstname(String firstname) {
        this.setFirstname(firstname);
        return this;
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

    public String getPassworld() {
        return this.passworld;
    }

    public SubscribedClients passworld(String passworld) {
        this.setPassworld(passworld);
        return this;
    }

    public void setPassworld(String passworld) {
        this.passworld = passworld;
    }

    public SubscribedClients address(String address) {
        this.setAddress(address);
        return this;
    }

    public String getBanckCard() {
        return this.banckCard;
    }

    public SubscribedClients banckCard(String banckCard) {
        this.setBanckCard(banckCard);
        return this;
    }

    public void setBanckCard(String banckCard) {
        this.banckCard = banckCard;
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
            ", lastname='" + getLastname() + "'" +
            ", firstname='" + getFirstname() + "'" +
            ", birthday='" + getBirthday() + "'" +
            ", email='" + getEmail() + "'" +
            ", passworld='" + getPassworld() + "'" +
            ", address='" + getAddress() + "'" +
            ", banckCard='" + getBanckCard() + "'" +
            ", phone='" + getPhone() + "'" +
            ", points=" + getPoints() +
            ", basket=" + getBasket() +
            ", favorises=" + getFavorises() +
            ", historiques=" + getHistoriques() +
            "}";
    }
}
