package fr.cdlja.weebsport.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.cdlja.weebsport.domain.*;
import fr.cdlja.weebsport.domain.enumeration.MeansOfPayment;
import fr.cdlja.weebsport.domain.enumeration.Status;
import fr.cdlja.weebsport.repository.*;
import fr.cdlja.weebsport.service.dto.OrderDTO;
import java.time.LocalDateTime;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
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
    private final ObjectMapper jacksonObjectMapper;

    public BasketService(
        SubscribedClientsService subscribedClientsService,
        OrderLineRepository orderLineRepository,
        StockRepository stockRepository,
        UserRepository userRepository,
        OrderRepository orderRepository,
        SubscribedClientsRepository subscribedClientsRepository,
        UserService userService,
        ObjectMapper jacksonObjectMapper
    ) {
        this.subscribedClientsService = subscribedClientsService;
        this.orderLineRepository = orderLineRepository;
        this.stockRepository = stockRepository;
        this.orderRepository = orderRepository;
        this.subscribedClientsRepository = subscribedClientsRepository;
        this.userService = userService;
        this.jacksonObjectMapper = jacksonObjectMapper;
    }

    public void ajouterArticle(Long articleId) throws Exception {
        SubscribedClients optional = subscribedClientsRepository
            .findByEmail(userService.getUserWithAuthorities().orElseThrow().getEmail())
            .orElseThrow();

        Order order = optional.getBasket();
        Set<OrderLine> orderLines = order.getOrderLines();

        if (orderLines == null) {
            throw new RuntimeException("Error retrieving order lines for basket : " + order.getId());
        }
        boolean isPresent = false;
        for (OrderLine o : orderLines) {
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
            order.addOrderLine(o);
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
        SubscribedClients optional = subscribedClientsRepository
            .findByEmail(userService.getUserWithAuthorities().orElseThrow().getEmail())
            .orElseThrow();

        Order order = optional.getBasket();
        Set<OrderLine> orderLines = order.getOrderLines();

        boolean articleFound = false;
        for (OrderLine o : orderLines) {
            if ((o.getStock().getId()).equals(articleId)) {
                articleFound = true;
                if (o.getQuantity() > 1) {
                    o.setQuantity(-1 + (o.getQuantity()));
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

    public enum PaymentResult {
        Success("Your payement succeeded", HttpStatus.OK),
        CardNb("The card number is invalid"),
        Expired("The card has expired"),
        Crypto("The crypto is incorrect");

        public final String msg;
        public final HttpStatus status;

        PaymentResult(String msg) {
            this(msg, HttpStatus.PAYMENT_REQUIRED);
        }

        PaymentResult(String msg, HttpStatus status) {
            this.msg = msg;
            this.status = status;
        }
    }

    public PaymentResult pay(String cardNum, int month, int year, String crypto, OrderDTO basket, MeansOfPayment meanOfPayment)
        throws InterruptedException {
        if (cardNum.charAt(0) != '8' || cardNum.charAt(cardNum.length() - 1) != '2') {
            return PaymentResult.CardNb;
        }

        LocalDateTime now = LocalDateTime.now();
        if (year < now.getYear()) {
            revertStocks();
            return PaymentResult.Expired;
        }

        if (year == now.getYear() && month < now.getMonthValue()) {
            revertStocks();
            return PaymentResult.Expired;
        }

        if (crypto.equals("666")) {
            revertStocks();
            return PaymentResult.Crypto;
        }

        if (basket != null) {
            Thread.sleep(1_000);
            return PaymentResult.Success;
        }

        SubscribedClients subscribedClients = subscribedClientsRepository
            .findByEmail(userService.getUserWithAuthorities().orElseThrow().getEmail())
            .orElseThrow();

        Order basketOrder = subscribedClients.getBasket().status(Status.PAID).meanOfPayment(meanOfPayment);

        try {
            LOG.debug(jacksonObjectMapper.writeValueAsString(basketOrder));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        orderRepository.save(basketOrder);

        Thread.sleep(2_000);

        subscribedClientsService.createBasket(subscribedClients);
        subscribedClientsRepository.save(subscribedClients);

        return PaymentResult.Success;
    }

    private void revertStocks() {}
}
