package fr.cdlja.weebsport.domain;

import fr.cdlja.weebsport.domain.enumeration.MeansOfPayment;

public abstract class AbstractClient {

    private String lastname;
    private String firstname;
    private String email;
    private String address;
    MeansOfPayment meansOfPayment;

    public abstract String gettypeClient();

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

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

    public MeansOfPayment getMeansOfPayment() {
        return meansOfPayment;
    }

    public void setMeansOfPayment(MeansOfPayment meansOfPayment) {
        this.meansOfPayment = meansOfPayment;
    }
}