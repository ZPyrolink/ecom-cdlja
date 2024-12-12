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

        createBasket(subscribedClients);
        subscribedClientsRepository.save(subscribedClients);
    }

    public void createBasket(SubscribedClients subscribedClients) {
        Order basket = new Order();
        basket.setDeliveryAddress(subscribedClients.getAddress());
        basket.setStatus(Status.BASKET);
        subscribedClients.setBasket(basket);
        orderRepository.save(basket);
    }

    public SubscribedClientDTO getClientByEmail(String email) {
        SubscribedClients client = subscribedClientsRepository
            .findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Client not found with email: " + email));

        return new SubscribedClientDTO(client); // Transformer l'entité en DTO si nécessaire
    }

    public OrderDTO getBasket(String email, Pageable pageable) throws Exception {
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
        int nblignes = 0;
        Page<OrderLine> orderlines = orderLineRepository.getlines(o.getId(), pageable);
        if (!orderlines.isEmpty()) {
            for (OrderLine ol : orderlines) {
                nblignes++;
                s = orderLineRepository.getArticle(ol.getId());
                if (s == null) {
                    throw new IllegalStateException("Stock not found for OrderLine ID: " + ol.getId());
                }

                sDTO = new StockDTO(s);
                c = stockRepository.getClothe(s.getId());
                cDTO = new ClotheDTO(c);
                sDTO.setClotheDTO(cDTO);
                orderLineDTO = new OrderlineDTO(ol);
                orderLineDTO.setStockDTO(sDTO);
                orderDTO.addArticle(orderLineDTO);
            }
        }
        orderDTO.setTotalElements(nblignes);
        orderDTO.setTotalPages(orderlines.getTotalPages());
        orderDTO.setSize(6);
        orderDTO.setNumber(orderlines.getNumber());
        orderDTO.setFirst(orderlines.isFirst());
        orderDTO.setLast(orderlines.isLast());
        return orderDTO;
    }

    public List<OrderDTO> getHistorique(String email, Pageable pageable) throws Exception {
        Long client_id = subscribedClientsRepository.findByEmail(email).orElseThrow().getId();

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
        int nborder = 0;
        for (Order o : orders) {
            nborder++;
            int nblignes = 0;
            orderDTO = new OrderDTO(o);
            Page<OrderLine> orderlines = orderLineRepository.getlines(o.getId(), pageable);
            if (!orderlines.isEmpty()) {
                for (OrderLine ol : orderlines) {
                    nblignes++;
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
            orderDTO.setTotalElements(nblignes);
            orderDTO.setTotalPages(orderlines.getTotalPages());
            orderDTO.setSize(6);
            orderDTO.setNumber(orderlines.getNumber());
            orderDTO.setFirst(orderlines.isFirst());
            orderDTO.setLast(orderlines.isLast());

            historique.add(orderDTO);
        }

        return historique;
    }
}
