package fr.cdlja.weebsport.service;

import fr.cdlja.weebsport.domain.OrderLine;
import fr.cdlja.weebsport.domain.Stock;
import fr.cdlja.weebsport.repository.OrderLineRepository;
import fr.cdlja.weebsport.repository.StockRepository;
import fr.cdlja.weebsport.repository.UserRepository;
import fr.cdlja.weebsport.security.SecurityUtils;
import fr.cdlja.weebsport.service.dto.OrderDTO;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class BasketService {

    public final SubscribedClientsService subscribedClientsService;
    private final OrderLineRepository orderLineRepository;
    private final StockRepository stockRepository;
    private final UserRepository userRepository;

    public BasketService(
        SubscribedClientsService subscribedClientsService,
        OrderLineRepository orderLineRepository,
        StockRepository stockRepository,
        UserRepository userRepository
    ) {
        this.subscribedClientsService = subscribedClientsService;
        this.orderLineRepository = orderLineRepository;
        this.stockRepository = stockRepository;
        this.userRepository = userRepository;
    }

    public void ajouterArticle(Long articleId) throws Exception {
        String userLogin = String.valueOf(SecurityUtils.getCurrentUserLogin());
        String userEmail =
            (userRepository.findOneByLogin(userLogin)).orElseThrow(() -> new Exception("User not found with login: " + userLogin)
                ).getEmail();
        OrderDTO panierDTO = (subscribedClientsService.getBasket(userEmail));
        List<OrderLine> orderlines = orderLineRepository.getlines(panierDTO.getId());
        Boolean isPresent = false;
        for (OrderLine o : orderlines) {
            if ((o.getStock().getId()).equals(articleId)) {
                o.setQuantity(1 + (o.getQuantity()));
                isPresent = !isPresent;
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
    }

    public void supprimerArticle(Long articleId) throws Exception {
        String userLogin = String.valueOf(SecurityUtils.getCurrentUserLogin());
        String userEmail =
            (userRepository.findOneByLogin(userLogin)).orElseThrow(() -> new Exception("User not found with login: " + userLogin)
                ).getEmail();
        OrderDTO panierDTO = subscribedClientsService.getBasket(userEmail);
        List<OrderLine> orderlines = orderLineRepository.getlines(panierDTO.getId());
        for (OrderLine o : orderlines) {
            if ((o.getStock().getId()).equals(articleId)) {
                if (o.getQuantity() > 1) o.setQuantity(-1 + (o.getQuantity()));
                else orderLineRepository.delete(o);
                break;
            }
        }
    }
}
