package fr.cdlja.weebsport.service;

import fr.cdlja.weebsport.domain.*;
import fr.cdlja.weebsport.repository.*;
import fr.cdlja.weebsport.service.dto.OrderDTO;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class BasketService {

    private static final Logger LOG = LoggerFactory.getLogger(BasketService.class);
    public final SubscribedClientsService subscribedClientsService;
    private final OrderLineRepository orderLineRepository;
    private final StockRepository stockRepository;

    private final OrderRepository orderRepository;
    private final SubscribedClientsRepository subscribedClientsRepository;
    private final UserService userService;

    public BasketService(
        SubscribedClientsService subscribedClientsService,
        OrderLineRepository orderLineRepository,
        StockRepository stockRepository,
        UserRepository userRepository,
        OrderRepository orderRepository,
        SubscribedClientsRepository subscribedClientsRepository,
        UserService userService
    ) {
        this.subscribedClientsService = subscribedClientsService;
        this.orderLineRepository = orderLineRepository;
        this.stockRepository = stockRepository;
        this.orderRepository = orderRepository;
        this.subscribedClientsRepository = subscribedClientsRepository;
        this.userService = userService;
    }

    public void ajouterArticle(Long articleId, int quantite) throws Exception {
        SubscribedClients optional = subscribedClientsRepository
            .findByEmail(userService.getUserWithAuthorities().orElseThrow().getEmail())
            .orElseThrow();
        if (quantite <= 0) {
            throw new IllegalArgumentException("Quantité invalide : " + quantite);
        }

        Order order = optional.getBasket();
        Set<OrderLine> orderLines = order.getOrderLines();

        if (orderLines == null) {
            throw new RuntimeException("Error retrieving order lines for basket : " + order.getId());
        }
        boolean isPresent = false;
        for (OrderLine o : orderLines) {
            if ((o.getStock().getId()).equals(articleId)) {
                if (o.getStock().getQuantity() < quantite) {
                    throw new RuntimeException("Stock is out of stock for article: " + articleId);
                }
                o.setQuantity(quantite + (o.getQuantity()));
                o.setAmountline(o.getQuantity() * (o.getStock().getClothe().getPrice())); // Update the price of the orderline
                order.setAmount(order.computeAmount()); // Update the price of the order
                orderLineRepository.save(o);
                orderRepository.save(order);
                isPresent = true;
                break;
            }
        }
        if (!isPresent) {
            OrderLine o = new OrderLine();
            order.addOrderLine(o);
            Stock stock = stockRepository.getReferenceById(articleId);
            if (stock.getQuantity() == 0) {
                throw new RuntimeException("Stock is out of stock for article : " + articleId);
            }
            o.setStock(stock);
            o.setQuantity(quantite);
            o.setAmountline(o.getQuantity() * (o.getStock().getClothe().getPrice()));
            o.setOrder(order);
            order.setAmount(order.computeAmount());
            orderLineRepository.save(o);
            orderRepository.save(order);
        }
    }

    public void supprimerArticle(Long articleId, int quantite) throws Exception {
        SubscribedClients optional = subscribedClientsRepository
            .findByEmail(userService.getUserWithAuthorities().orElseThrow().getEmail())
            .orElseThrow();

        if (quantite <= 0) {
            throw new IllegalArgumentException("Quantité invalide : " + quantite);
        }

        Order order = optional.getBasket();
        Set<OrderLine> orderLines = order.getOrderLines();

        boolean articleFound = false;
        for (OrderLine o : orderLines) {
            if ((o.getStock().getId()).equals(articleId)) {
                articleFound = true;
                if ((o.getQuantity() - quantite) > 0) {
                    o.setQuantity(o.getQuantity() - quantite);
                    o.setAmountline(o.getQuantity() * (o.getStock().getClothe().getPrice()));
                    order.setAmount(order.computeAmount());
                    orderLineRepository.save(o);
                    orderRepository.save(order);
                } else {
                    order.removeOrderLine(o);
                    order.setAmount(order.computeAmount());
                    orderLineRepository.delete(o);
                    orderRepository.save(order);
                }
                break;
            }
        }
        if (!articleFound) {
            throw new RuntimeException("Article with id " + articleId + " not found in the basket.");
        }
    }

    public Long countNbArticles(OrderDTO panierDTO) throws Exception {
        //recupère le nb d'article de chaque ligne de commande et additionne
        return orderLineRepository.getQuantity(panierDTO.getId());
    }

    public Float price(User user) {
        return orderRepository.getPrice(user.getId());
    }

    public Long countnbArticles(OrderDTO panierDTO) throws Exception {
        //recupère le nb d'article de chaque ligne de commande et additionne
        Long nbarticles = orderLineRepository.getQuantity(panierDTO.getId());
        return nbarticles;
    }
}
