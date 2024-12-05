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
        subscribedClients.setBasket(basket);
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
        if (optionalClient.isPresent()) {
            SubscribedClients client = optionalClient.orElseThrow();
            o = client.getBasket();
            // Traitez le panier ici
        } else {
            throw new Exception("Client not found for email: " + email);
        }

        Stock s;
        StockDTO sDTO;
        Clothe c;
        ClotheDTO cDTO;
        OrderlineDTO orderLineDTO;
        OrderDTO orderDTO;
        orderDTO = new OrderDTO(o);
        Pageable pageable = PageRequest.of(0, 5);
        Page<OrderLine> orderlines = orderLineRepository.getlines(o.getId(), pageable);
        if (!orderlines.isEmpty()) {
            for (OrderLine ol : orderlines) {
                s = orderLineRepository.getArticle(ol.getId());
                sDTO = new StockDTO(s);
                c = stockRepository.getClothe(s.getId());
                cDTO = new ClotheDTO(c);
                sDTO.setClotheDTO(cDTO);
                orderLineDTO = new OrderlineDTO(ol);
                orderLineDTO.setStockDTO(sDTO);
                orderDTO.addArticle(orderLineDTO);
            }
        }

        return orderDTO;
    }

    public List<OrderDTO> getHistorique(String email) {
        Long client_id = subscribedClientsRepository.findByEmail(email).orElseThrow().getId();

        Pageable pageable = PageRequest.of(0, 5);
        Page<Order> orders = orderRepository.getHistorique(client_id, pageable);
        List<OrderDTO> historique = new ArrayList<>();
        if (orders.isEmpty()) {
            return historique;
        }

        OrderlineDTO orderLineDTO;
        OrderDTO orderDTO;
        Stock s;
        StockDTO sDTO;
        Clothe c;
        ClotheDTO cDTO;
        for (Order o : orders) {
            orderDTO = new OrderDTO(o);
            Page<OrderLine> orderlines = orderLineRepository.getlines(o.getId(), pageable);
            if (!orderlines.isEmpty()) {
                for (OrderLine ol : orderlines) {
                    s = orderLineRepository.getArticle(ol.getId());
                    sDTO = new StockDTO(s);
                    c = stockRepository.getClothe(s.getId());
                    cDTO = new ClotheDTO(c);
                    sDTO.setClotheDTO(cDTO);
                    orderLineDTO = new OrderlineDTO(ol);
                    orderLineDTO.setStockDTO(sDTO);
                    orderDTO.addArticle(orderLineDTO);
                }
            }

            historique.add(orderDTO);
        }
        return historique;
    }
}
