package fr.cdlja.weebsport.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.cdlja.weebsport.domain.enumeration.Category;
import fr.cdlja.weebsport.domain.enumeration.Gender;
import fr.cdlja.weebsport.domain.enumeration.Type;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Clothe.
 */
@Entity
@Table(name = "clothe")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Clothe implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private Type type;

    @Column(name = "theme")
    private String theme;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "price")
    private Float price;

    @Column(name = "description")
    private String description;

    @Column(name = "imageP")
    private String imageP;

    @ElementCollection
    @CollectionTable(name = "clothe_categories", joinColumns = @JoinColumn(name = "clothe_id"))
    @Column(name = "category")
    private Set<Category> Categories;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Set<Category> getCategories() {
        return Categories;
    }

    public void setCategories(Set<Category> categories) {
        Categories = categories;
    }

    public Clothe category(Set<Category> categories) {
        this.setCategories(categories);
        return this;
    }

    public Clothe addCategory(Category category) {
        getCategories().add(category);
        return this;
    }

    public Clothe removeCategory(Category category) {
        getCategories().remove(category);
        return this;
    }

    public Long getId() {
        return this.id;
    }

    public Clothe id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Type getType() {
        return this.type;
    }

    public Clothe type(Type type) {
        this.setType(type);
        return this;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public String getTheme() {
        return this.theme;
    }

    public Clothe theme(String theme) {
        this.setTheme(theme);
        return this;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public Gender getGender() {
        return this.gender;
    }

    public Clothe gender(Gender gender) {
        this.setGender(gender);
        return this;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Float getPrice() {
        return this.price;
    }

    public Clothe price(Float price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public String getDescription() {
        return this.description;
    }

    public Clothe description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageP() {
        return this.imageP;
    }

    public void imageP(String imageP) {
        this.imageP = imageP;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Clothe)) {
            return false;
        }
        return getId() != null && getId().equals(((Clothe) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Clothe{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", theme='" + getTheme() + "'" +
            ", gender='" + getGender() + "'" +
            ", price=" + getPrice() +
            ", description='" + getDescription() + "'" +
            ", categories='" + getCategories() + "'" +
            ", imageP='" + getImageP() + "'" +
            "}";
    }
}
