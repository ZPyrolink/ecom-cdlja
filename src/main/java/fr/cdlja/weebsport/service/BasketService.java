package fr.cdlja.weebsport.service;

import fr.cdlja.weebsport.domain.Order;
import fr.cdlja.weebsport.domain.OrderLine;
import fr.cdlja.weebsport.domain.Stock;
import fr.cdlja.weebsport.domain.SubscribedClients;
import fr.cdlja.weebsport.repository.*;
import fr.cdlja.weebsport.security.SecurityUtils;
import java.util.Optional;
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
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final SubscribedClientsRepository subscribedClientsRepository;

    public BasketService(
        SubscribedClientsService subscribedClientsService,
        OrderLineRepository orderLineRepository,
        StockRepository stockRepository,
        UserRepository userRepository,
        OrderRepository orderRepository,
        SubscribedClientsRepository subscribedClientsRepository
    ) {
        this.subscribedClientsService = subscribedClientsService;
        this.orderLineRepository = orderLineRepository;
        this.stockRepository = stockRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.subscribedClientsRepository = subscribedClientsRepository;
    }

    public void ajouterArticle(Long articleId) throws Exception {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not logged in"));
        if (userLogin == null || userLogin.isEmpty()) {
            throw new IllegalStateException("No subscribedUser actually logged in.");
        }
        String userEmail = userRepository
            .findOneByLogin(userLogin)
            .orElseThrow(() -> new RuntimeException("User not found with login: " + userLogin))
            .getEmail();

        Optional<SubscribedClients> optionalClient = subscribedClientsRepository.findByEmail(userEmail);
        Order order;
        SubscribedClients client = optionalClient.orElseThrow();
        order = client.getBasket();

        Set<OrderLine> orderlines = order.getOrderlines();
        if (orderlines == null) {
            throw new RuntimeException("Error retrieving order lines for basket : " + order.getId());
        }
        boolean isPresent = false;
        for (OrderLine o : orderlines) {
            if ((o.getStock().getId()).equals(articleId)) {
                if (o.getStock().getQuantity() == 0) {
                    throw new RuntimeException("Stock is out of stock for article: " + articleId);
                }
                o.setQuantity(1 + (o.getQuantity()));
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
            order.addOrderline(o);
            Stock stock = stockRepository.getReferenceById(articleId);
            if (stock.getQuantity() == 0) {
                throw new RuntimeException("Stock is out of stock for article : " + articleId);
            }
            o.setStock(stock);
            o.setQuantity(1);
            o.setAmountline(o.getQuantity() * (o.getStock().getClothe().getPrice()));
            o.setOrder(order);
            order.setAmount(order.computeAmount());
            orderLineRepository.save(o);
            orderRepository.save(order);
        }
    }

    public void supprimerArticle(Long articleId) throws Exception {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not logged in"));
        String userEmail = userRepository
            .findOneByLogin(userLogin)
            .orElseThrow(() -> new RuntimeException("User not found with login: " + userLogin))
            .getEmail();
        Optional<SubscribedClients> optionalClient = subscribedClientsRepository.findByEmail(userEmail);
        Order order;
        SubscribedClients client = optionalClient.orElseThrow();
        order = client.getBasket();

        Set<OrderLine> orderlines = order.getOrderlines();
        for (OrderLine o : orderlines) {
            if ((o.getStock().getId()).equals(articleId)) {
                if (o.getQuantity() > 1) {
                    o.setQuantity(-1 + (o.getQuantity()));
                    o.setAmountline(o.getQuantity() * (o.getStock().getClothe().getPrice()));
                    order.setAmount(order.computeAmount());
                    orderLineRepository.save(o);
                    orderRepository.save(order);
                } else {
                    order.removeOrderline(o);
                    order.setAmount(order.computeAmount());
                    orderLineRepository.delete(o);
                    orderRepository.save(order);
                }
                break;
            }
        }
    }
}
