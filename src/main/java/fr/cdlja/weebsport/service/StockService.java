package fr.cdlja.weebsport.service;

import fr.cdlja.weebsport.domain.OrderLine;
import fr.cdlja.weebsport.domain.Stock;
import fr.cdlja.weebsport.domain.SubscribedClients;
import fr.cdlja.weebsport.repository.ClotheRepository;
import fr.cdlja.weebsport.repository.OrderLineRepository;
import fr.cdlja.weebsport.repository.StockRepository;
import fr.cdlja.weebsport.repository.SubscribedClientsRepository;
import fr.cdlja.weebsport.service.dto.OrderDTO;
import fr.cdlja.weebsport.service.dto.OrderlineDTO;
import fr.cdlja.weebsport.service.dto.StockDTO;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    private final ClotheRepository clotheRepository;

    public StockService(
        OrderLineRepository orderLineRepository,
        StockRepository stockRepository,
        ClotheRepository clotheRepository,
        SubscribedClientsRepository subscribedClientsRepository,
        SubscribedClientsService subscribedClientsService
    ) {
        this.orderLineRepository = orderLineRepository;
        this.subscribedClientsRepository = subscribedClientsRepository;
        this.subscribedClientsService = subscribedClientsService;
        this.clotheRepository = clotheRepository;
        this.stockRepository = stockRepository;
    }

    public void validebasketabo(Long clientid) throws Exception {
        SubscribedClients client = subscribedClientsRepository
            .findById(clientid)
            .orElseThrow(() -> new RuntimeException("Client not found"));
        String email = client.getEmail();
        Pageable pageable = PageRequest.of(0, 10, Sort.by("id").ascending());
        OrderDTO basket = subscribedClientsService.getBasket(email, pageable);
        Long orderid = basket.getId();
        Page<OrderLine> lines = orderLineRepository.getlines(orderid, pageable);
        for (OrderLine orderLine : lines) {
            Stock stock = orderLineRepository.getArticle(orderLine.getId());
            Object[][] res = stockRepository.readStock(stock.getId());
            if (res != null) {
                int quantity = (int) res[0][0];
                int version = (int) res[0][1];
                if (quantity == 0) {
                    throw new Exception(String.valueOf(stock.getId()));
                }
                Integer purchasequantity = orderLine.getQuantity();
                if (purchasequantity > quantity) {
                    throw new Exception("desired number greater than available quantity");
                }
                Integer newquantity = quantity - purchasequantity;
                int rowsAffected = stockRepository.updateStock(newquantity, version, stock.getId());
                if (!(rowsAffected > 0)) {
                    throw new Exception(String.valueOf(stock.getId()));
                }
            } else {
                throw new Exception(String.valueOf(stock.getId()));
            }
        }
    }

    public void validatebasketnonabo(OrderDTO orderDTO) throws Exception {
        List<OrderlineDTO> lines = orderDTO.getOrderLines();
        if (lines.isEmpty()) {
            throw new Exception("Order line is empty");
        }
        for (OrderlineDTO orderlineDTO : lines) {
            Integer purchasequantity = orderlineDTO.getQuantity();
            StockDTO stockDTO = orderlineDTO.getStockDTO();
            Object[][] res = stockRepository.readStock(stockDTO.getId());
            if (res.length != 0) {
                int quantity = (int) res[0][0];
                int version = (int) res[0][1];
                if (quantity == 0) {
                    throw new Exception(String.valueOf(stockDTO.getId()));
                }

                if (purchasequantity > quantity) {
                    throw new Exception("desired number greater than available quantity");
                }
                Integer newquantity = quantity - purchasequantity;
                //si ici on met version à O, c'est à dire une version inférieur à la dernière faites
                //donc comme si une commande à été validée depuis la lecture la requete echou et la commande est impossible
                int rowsAffected = stockRepository.updateStock(newquantity, version, stockDTO.getId());
                if (!(rowsAffected > 0)) {
                    throw new Exception(String.valueOf(stockDTO.getId()));
                }
            } else {
                throw new Exception(String.valueOf(stockDTO.getId()));
            }
        }
    }
}
