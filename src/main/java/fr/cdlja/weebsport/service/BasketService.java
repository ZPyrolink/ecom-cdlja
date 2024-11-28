package fr.cdlja.weebsport.service;

import fr.cdlja.weebsport.domain.Order;
import fr.cdlja.weebsport.domain.OrderLine;
import fr.cdlja.weebsport.domain.Stock;
import fr.cdlja.weebsport.domain.SubscribedClients;
import fr.cdlja.weebsport.repository.*;
import fr.cdlja.weebsport.security.SecurityUtils;
import fr.cdlja.weebsport.service.dto.OrderDTO;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
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

    public OrderDTO ajouterArticle(Long articleId) throws Exception {
        String userLogin = String.valueOf(SecurityUtils.getCurrentUserLogin());
        if (userLogin == null || userLogin.isEmpty()) {
            throw new IllegalStateException("No subscribedUser actually logged in.");
        }
        String userEmail =
            (userRepository.findOneByLogin(userLogin)).orElseThrow(() -> new Exception("User not found with login: " + userLogin)
                ).getEmail();
        OrderDTO panierDTO = (subscribedClientsService.getBasket(userEmail));
        if (panierDTO == null) {
            throw new Exception("No basket found for user whose email is : " + userEmail);
        }
        List<OrderLine> orderlines = orderLineRepository.getlines(panierDTO.getId());
        if (orderlines == null) {
            throw new Exception("Error retrieving order lines for basket : " + panierDTO.getId());
        }
        boolean isPresent = false;
        for (OrderLine o : orderlines) {
            if ((o.getStock().getId()).equals(articleId)) {
                o.setQuantity(1 + (o.getQuantity()));
                isPresent = true;
                orderLineRepository.save(o);
                break;
            }
        }
        if (!isPresent) {
            OrderLine o = new OrderLine();
            Stock stock = stockRepository.getReferenceById(articleId);
            o.setStock(stock);
            o.setQuantity(1);
            o.setOrder(orderLineRepository.getReferenceById(panierDTO.getId()).getOrder());
            orderLineRepository.save(o);
        }
        return subscribedClientsService.getBasket(userEmail);
    }

    public OrderDTO supprimerArticle(Long articleId) throws Exception {
        String userLogin = String.valueOf(SecurityUtils.getCurrentUserLogin());
        if (userLogin == null || userLogin.isEmpty()) {
            throw new IllegalStateException("No subscribedUser actually logged in.");
        }
        String userEmail =
            (userRepository.findOneByLogin(userLogin)).orElseThrow(() -> new Exception("User not found with login: " + userLogin)
                ).getEmail();
        OrderDTO panierDTO = subscribedClientsService.getBasket(userEmail);
        if (panierDTO == null) {
            throw new Exception("No basket found for user whose email is : " + userEmail);
        }
        List<OrderLine> orderlines = orderLineRepository.getlines(panierDTO.getId());
        if (orderlines == null) {
            throw new Exception("Error retrieving order lines for basket : " + panierDTO.getId());
        }
        for (OrderLine o : orderlines) {
            if ((o.getStock().getId()).equals(articleId)) {
                if (o.getQuantity() > 1) {
                    o.setQuantity(-1 + (o.getQuantity()));
                    orderLineRepository.save(o);
                } else orderLineRepository.delete(o);
                break;
            }
        }
        return subscribedClientsService.getBasket(userEmail);
    }

    public Integer countnbArticles(OrderDTO panierDTO) throws Exception {
        //recupère le nb d'article de chaque ligne de commande et additionne
        return null;
    }
}
