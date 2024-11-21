package fr.cdlja.weebsport.service;

import fr.cdlja.weebsport.domain.Order;
import fr.cdlja.weebsport.domain.SubscribedClients;
import fr.cdlja.weebsport.domain.enumeration.Status;
import fr.cdlja.weebsport.repository.OrderRepository;
import fr.cdlja.weebsport.repository.SubscribedClientsRepository;
import fr.cdlja.weebsport.service.dto.SubscribedClientDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SubscribedClientsService {

    private final SubscribedClientsRepository subscribedClientsRepository;
    private final OrderRepository orderRepository;

    public SubscribedClientsService(SubscribedClientsRepository subscribedClientsRepository, OrderRepository orderRepository) {
        this.subscribedClientsRepository = subscribedClientsRepository;
        this.orderRepository = orderRepository;
    }

    public void registerClient(SubscribedClients subscribedClient) {
        subscribedClientsRepository.save(subscribedClient);
    }

    public Order createBasket(SubscribedClients subscribedClient) {
        Order order = new Order();
        //adresse de livraison par défaut
        order.setDeliveryAddress(subscribedClient.getAddress());
        order.setClient(subscribedClient);
        order.setStatus(Status.BASKET);
        return orderRepository.save(order);
    }

    public SubscribedClientDTO getClientByEmail(String email) {
        SubscribedClients client = subscribedClientsRepository
            .findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Client not found with email: " + email));

        return new SubscribedClientDTO(client); // Transformer l'entité en DTO si nécessaire
    }
}
