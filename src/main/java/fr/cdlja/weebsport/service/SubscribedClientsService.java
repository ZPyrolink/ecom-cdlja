package fr.cdlja.weebsport.service;

import fr.cdlja.weebsport.domain.*;
import fr.cdlja.weebsport.domain.enumeration.Status;
import fr.cdlja.weebsport.repository.OrderLineRepository;
import fr.cdlja.weebsport.repository.OrderRepository;
import fr.cdlja.weebsport.repository.StockRepository;
import fr.cdlja.weebsport.repository.SubscribedClientsRepository;
import fr.cdlja.weebsport.service.dto.*;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SubscribedClientsService {

    private final SubscribedClientsRepository subscribedClientsRepository;
    private final OrderRepository orderRepository;
    private final OrderLineRepository orderLineRepository;
    private final StockRepository stockRepository;

    public SubscribedClientsService(
        SubscribedClientsRepository subscribedClientsRepository,
        OrderRepository orderRepository,
        OrderLineRepository orderLineRepository,
        StockRepository stockRepository
    ) {
        this.subscribedClientsRepository = subscribedClientsRepository;
        this.orderRepository = orderRepository;
        this.orderLineRepository = orderLineRepository;
        this.stockRepository = stockRepository;
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

    public OrderDTO getBasket(String email) {
        Order o = subscribedClientsRepository.findByEmail(email).get().getBasket();
        List<OrderLine> orderlines = new ArrayList<>();
        Stock article;
        StockDTO articleDTO;
        Clothe vetement;
        ClotheDTO vetementDTO;
        OrderlineDTO orderLineDTO;
        OrderDTO orderDTO;
        orderDTO = new OrderDTO(o);
        orderlines = orderLineRepository.getlines(o.getId());
        for (OrderLine ol : orderlines) {
            article = orderLineRepository.getArticle(ol.getId());
            articleDTO = new StockDTO(article);
            vetement = stockRepository.getClothe(article.getId());
            vetementDTO = new ClotheDTO(vetement);
            articleDTO.setClotheDTO(vetementDTO);
            orderLineDTO = new OrderlineDTO(ol);
            orderLineDTO.setStockDTO(articleDTO);
            orderDTO.addArticle(orderLineDTO);
        }

        return new OrderDTO(o);
    }

    public List<OrderDTO> getHistorique(String email) {
        Long client_id = subscribedClientsRepository.findByEmail(email).get().getId();
        List<Order> orders = orderRepository.getHistorique(client_id);
        List<OrderDTO> historique = new ArrayList<>();
        List<OrderLine> orderlines = new ArrayList<>();
        OrderlineDTO orderLineDTO;
        OrderDTO orderDTO;
        Stock article;
        StockDTO articleDTO;
        Clothe vetement;
        ClotheDTO vetementDTO;
        for (Order o : orders) {
            orderDTO = new OrderDTO(o);
            orderlines = orderLineRepository.getlines(o.getId());
            for (OrderLine ol : orderlines) {
                article = orderLineRepository.getArticle(ol.getId());
                articleDTO = new StockDTO(article);
                vetement = stockRepository.getClothe(article.getId());
                vetementDTO = new ClotheDTO(vetement);
                articleDTO.setClotheDTO(vetementDTO);
                orderLineDTO = new OrderlineDTO(ol);
                orderLineDTO.setStockDTO(articleDTO);
                orderDTO.addArticle(orderLineDTO);
            }

            historique.add(orderDTO);
        }
        return historique;
    }
}