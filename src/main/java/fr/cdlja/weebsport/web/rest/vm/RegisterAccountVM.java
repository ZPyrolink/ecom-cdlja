package fr.cdlja.weebsport.web.rest.vm;

import fr.cdlja.weebsport.service.dto.SubscribedClientDTO;

public class RegisterAccountVM {

    private ManagedUserVM managedUser;
    private SubscribedClientDTO subscribedClient;

    public ManagedUserVM getManagedUser() {
        return managedUser;
    }

    public void setManagedUser(ManagedUserVM managedUser) {
        this.managedUser = managedUser;
    }

    public SubscribedClientDTO getSubscribedClient() {
        return subscribedClient;
    }

    public void setSubscribedClient(SubscribedClientDTO subscribedClient) {
        this.subscribedClient = subscribedClient;
    }
}
