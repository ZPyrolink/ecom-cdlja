package fr.cdlja.weebsport.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.cdlja.weebsport.domain.enumeration.Color;
import fr.cdlja.weebsport.domain.enumeration.Size;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Stock.
 */
@Entity
@Table(name = "stock")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Stock implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "stockSequenceGenerator")
    @SequenceGenerator(name = "stockSequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "color")
    private Color color;

    @Enumerated(EnumType.STRING)
    @Column(name = "size")
    private Size size;

    @Column(name = "quantity")
    private Integer quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clothe_id")
    @JsonIgnoreProperties(value = { "subscribedClients" }, allowSetters = true)
    private Clothe clothe;

    @ElementCollection
    @CollectionTable(name = "article_images", joinColumns = @JoinColumn(name = "article_id"))
    @Column(name = "image_url")
    private Set<String> imageUrls;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Set<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(Set<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public Stock images(Set<String> imageUrls) {
        this.setImageUrls(imageUrls);
        return this;
    }

    public Stock addImageUrl(String imageUrl) {
        this.imageUrls.add(imageUrl);
        return this;
    }

    public Stock removeImageUrl(String imageUrl) {
        this.imageUrls.remove(imageUrl);
        return this;
    }

    public Long getId() {
        return this.id;
    }

    public Stock id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Color getColor() {
        return this.color;
    }

    public Stock color(Color color) {
        this.setColor(color);
        return this;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public Size getSize() {
        return this.size;
    }

    public Stock size(Size size) {
        this.setSize(size);
        return this;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public Stock quantity(Integer quantity) {
        this.setQuantity(quantity);
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Clothe getClothe() {
        return this.clothe;
    }

    public void setClothe(Clothe clothe) {
        this.clothe = clothe;
    }

    public Stock clothe(Clothe clothe) {
        this.setClothe(clothe);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Stock)) {
            return false;
        }
        return getId() != null && getId().equals(((Stock) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Stock{" +
            "id=" + getId() +
            ", color='" + getColor() + "'" +
            ", size='" + getSize() + "'" +
            ", quantity=" + getQuantity() +
            ", clothe='" + getClothe() + "'" +
            ", imageUrls='" + getImageUrls() + "'" +
            "}";
    }
}
