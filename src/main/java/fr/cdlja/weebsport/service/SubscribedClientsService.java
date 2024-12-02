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
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SubscribedClientsService {

    private static final Logger LOG = LoggerFactory.getLogger(SubscribedClientsService.class);
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

    public void createClientWithBasket(User user, SubscribedClientDTO clientAbonned) {
        SubscribedClients subscribedClients = new SubscribedClients();
        subscribedClients.setEmail(user.getEmail());
        subscribedClients.setUser(user);
        subscribedClients.setAddress(clientAbonned.getAddress());
        subscribedClients.setBirthday(clientAbonned.getBirthday());
        subscribedClients.setPhone(clientAbonned.getPhoneNumber());
        subscribedClients.setBankCard(clientAbonned.getBankCard());
        Order basket = new Order();
        basket.setDeliveryAddress(clientAbonned.getAddress());
        basket.setStatus(Status.BASKET);
        LOG.debug("donner panié au client");
        subscribedClients.setBasket(basket);
        LOG.debug("donner client au panier");
        basket.setClient(subscribedClients);
        subscribedClientsRepository.save(subscribedClients);
    }

    public SubscribedClientDTO getClientByEmail(String email) {
        SubscribedClients client = subscribedClientsRepository
            .findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Client not found with email: " + email));

        return new SubscribedClientDTO(client); // Transformer l'entité en DTO si nécessaire
    }

    public OrderDTO getBasket(String email) throws Exception {
        Optional<SubscribedClients> optionalClient = subscribedClientsRepository.findByEmail(email);
        Order o;
        LOG.debug("subclienttrouvé");
        if (optionalClient.isPresent()) {
            SubscribedClients client = optionalClient.orElseThrow();
            o = client.getBasket();
            // Traitez le panier ici
        } else {
            throw new Exception("Client not found for email: " + email);
        }

        Stock article;
        StockDTO articleDTO;
        Clothe vetement;
        ClotheDTO vetementDTO;
        OrderlineDTO orderLineDTO;
        OrderDTO orderDTO;
        orderDTO = new OrderDTO(o);
        LOG.debug("recherche lignes");
        Pageable pageable = PageRequest.of(0, 10);
        Page<OrderLine> orderlines = orderLineRepository.getlines(o.getId(), pageable);
        LOG.debug("lignes trouvés");
        if (orderlines.isEmpty()) {
            LOG.debug("No order lines found : " + o.getId());
        } else {
            for (OrderLine ol : orderlines) {
                LOG.debug("recherche article");
                article = orderLineRepository.getArticle(ol.getId());
                articleDTO = new StockDTO(article);
                LOG.debug("recherche vetement");
                vetement = stockRepository.getClothe(article.getId());
                vetementDTO = new ClotheDTO(vetement);
                articleDTO.setClotheDTO(vetementDTO);
                orderLineDTO = new OrderlineDTO(ol);
                orderLineDTO.setStockDTO(articleDTO);
                orderDTO.addArticle(orderLineDTO);
            }
        }

        return orderDTO;
    }

    public List<OrderDTO> getHistorique(String email) throws Exception {
        Long client_id = subscribedClientsRepository.findByEmail(email).orElseThrow().getId();

        Pageable pageable = PageRequest.of(0, 10);
        Page<Order> orders = orderRepository.getHistorique(client_id, pageable);
        List<OrderDTO> historique = new ArrayList<>();
        if (orders.isEmpty()) {
            LOG.debug("No order found for client: " + client_id);
            return historique;
        }

        OrderlineDTO orderLineDTO;
        OrderDTO orderDTO;
        Stock article;
        StockDTO articleDTO;
        Clothe vetement;
        ClotheDTO vetementDTO;
        for (Order o : orders) {
            orderDTO = new OrderDTO(o);
            Page<OrderLine> orderlines = orderLineRepository.getlines(o.getId(), pageable);
            if (orderlines.isEmpty()) {
                LOG.debug("No order lines found : " + o.getId());
            } else {
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
            }

            historique.add(orderDTO);
        }
        return historique;
    }
}
