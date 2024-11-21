package fr.cdlja.weebsport.service.dto;

import fr.cdlja.weebsport.config.Constants;
import fr.cdlja.weebsport.domain.Authority;
import fr.cdlja.weebsport.domain.SubscribedClients;
import fr.cdlja.weebsport.domain.User;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

public class SubscribedClientDTO {

    @Email
    private String email;

    @NotNull
    private LocalDate birthday;

    @NotNull
    private String bankCard;

    @NotNull
    private String phoneNumber;

    private String address;

    public SubscribedClientDTO(SubscribedClients s) {
        this.email = s.getEmail();
        this.birthday = s.getBirthday();
        this.bankCard = s.getBankCard();
        this.phoneNumber = s.getPhone();
        this.address = s.getAddress();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getBirthday() {
        return birthday;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    public String getBankCard() {
        return bankCard;
    }

    public void setBankCard(String bankCard) {
        this.bankCard = bankCard;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
