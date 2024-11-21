package fr.cdlja.weebsport.domain;

import fr.cdlja.weebsport.domain.enumeration.MeansOfPayment;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class AbstractClient {

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    private String address;

    public abstract String gettypeClient();

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
