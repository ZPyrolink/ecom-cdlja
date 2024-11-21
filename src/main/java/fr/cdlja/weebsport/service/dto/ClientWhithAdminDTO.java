package fr.cdlja.weebsport.service.dto;

import java.util.ArrayList;
import java.util.List;

//permet de récup toutes info d'un clientAbo pour préremplir fiche commande
//ou afficher ses infos
public class ClientWhithAdminDTO {

    private SubscribedClientDTO subscribedClient;
    private AdminUserDTO adminUser;
    private OrderDTO panier;
    private List<OrderDTO> historique = new ArrayList<OrderDTO>();

    public ClientWhithAdminDTO(SubscribedClientDTO subscribedClientDTO, AdminUserDTO adminUserDTO) {
        this.subscribedClient = subscribedClientDTO;
        this.adminUser = adminUserDTO;
    }

    public SubscribedClientDTO getSubscribedClient() {
        return subscribedClient;
    }

    public void setSubscribedClient(SubscribedClientDTO subscribedClient) {
        this.subscribedClient = subscribedClient;
    }

    public AdminUserDTO getAdminUserDTO() {
        return adminUser;
    }

    public void setAdminUserDTO(AdminUserDTO adminUserDTO) {
        this.adminUser = adminUserDTO;
    }

    public List<OrderDTO> getHistorique() {
        return historique;
    }

    public void setHistorique(List<OrderDTO> historique) {
        this.historique = historique;
    }

    public void addHistorique(OrderDTO orderDTO) {
        historique.add(orderDTO);
    }

    public OrderDTO getPanier() {
        return panier;
    }

    public void setPanier(OrderDTO panier) {
        this.panier = panier;
    }
}
