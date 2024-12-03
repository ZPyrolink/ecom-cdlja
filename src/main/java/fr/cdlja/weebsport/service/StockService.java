package fr.cdlja.weebsport.service;

import fr.cdlja.weebsport.domain.Order;
import fr.cdlja.weebsport.domain.OrderLine;
import fr.cdlja.weebsport.domain.Stock;
import fr.cdlja.weebsport.domain.SubscribedClients;
import fr.cdlja.weebsport.repository.OrderLineRepository;
import fr.cdlja.weebsport.repository.StockRepository;
import fr.cdlja.weebsport.repository.SubscribedClientsRepository;
import fr.cdlja.weebsport.service.dto.OrderDTO;
import fr.cdlja.weebsport.service.dto.OrderlineDTO;
import fr.cdlja.weebsport.service.dto.StockDTO;
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
public class StockService {

    private static final Logger LOG = LoggerFactory.getLogger(UserService.class);
    private final OrderLineRepository orderLineRepository;

    private final StockRepository stockRepository;
    private final SubscribedClientsRepository subscribedClientsRepository;
    private final SubscribedClientsService subscribedClientsService;

    public StockService(
        OrderLineRepository orderLineRepository,
        StockRepository stockRepository,
        SubscribedClientsRepository subscribedClientsRepository,
        SubscribedClientsService subscribedClientsService
    ) {
        this.orderLineRepository = orderLineRepository;
        this.stockRepository = stockRepository;
        this.subscribedClientsRepository = subscribedClientsRepository;
        this.subscribedClientsService = subscribedClientsService;
    }

    public void validebasketabo(Long clientid) throws Exception {
        SubscribedClients client = subscribedClientsRepository
            .findById(clientid)
            .orElseThrow(() -> new RuntimeException("Client not found"));
        String email = client.getEmail();
        OrderDTO basket = subscribedClientsService.getBasket(email);
        Long orderid = basket.getId();
        Pageable pageable = PageRequest.of(0, 10);
        Page<OrderLine> lines = orderLineRepository.getlines(orderid, pageable);

        for (OrderLine orderLine : lines) {
            Stock stock = orderLineRepository.getArticle(orderLine.getId());
            Object[][] res = stockRepository.readStock(stock.getId());
            if (res != null) {
                LOG.debug("problem ici !!!");
                int quantity = (int) res[0][0];
                int version = (int) res[0][1];
                if (quantity == 0) {
                    throw new Exception("Stock quantity is zero");
                }

                Integer nbachat = orderLine.getQuantity();
                if (nbachat > quantity) {
                    throw new Exception("nb souhaité superieur à la quantité disponible");
                }
                Integer newquantity = quantity - nbachat;
                int rowsAffected = stockRepository.updateStock(newquantity, version, stock.getId());
                if (rowsAffected > 0) {
                    System.out.println("Update successful, rows affected: " + rowsAffected);
                } else {
                    throw new Exception("article non disponible");
                }
            } else {
                System.out.println("No stock found for ID: " + stock.getId());
            }
        }
    }

    public void validatebasketnonabo(OrderDTO orderDTO) throws Exception {
        List<OrderlineDTO> lines = orderDTO.getOrderLines();
        if (lines.isEmpty()) {
            throw new Exception("Order line is empty");
        }
        for (OrderlineDTO orderlineDTO : lines) {
            Integer quantityachat = orderlineDTO.getQuantity();
            StockDTO stockDTO = orderlineDTO.getStockDTO();
            Object[][] res = stockRepository.readStock(stockDTO.getId());
            if (res != null) {
                int quantity = (int) res[0][0];
                int version = (int) res[0][1];
                if (quantity == 0) {
                    throw new Exception("Stock quantity is zero");
                }

                if (quantityachat > quantity) {
                    throw new Exception("nb souhaité superieur à la quantité disponible");
                }
                Integer newquantity = quantity - quantityachat;
                //si ici on met version à O, c'est à dire une version inférieur à la dernière faites
                //donc comme si une commande à été validée depuis la lecture la requete echou et la commande est impossible
                int rowsAffected = stockRepository.updateStock(newquantity, version, stockDTO.getId());
                if (rowsAffected > 0) {
                    System.out.println("Update successful, rows affected: " + rowsAffected);
                } else {
                    throw new Exception("article non disponible");
                }
            } else {
                System.out.println("No stock found for ID: " + stockDTO.getId());
            }
        }
    }
}
