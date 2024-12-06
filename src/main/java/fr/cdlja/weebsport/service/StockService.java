package fr.cdlja.weebsport.service;

import fr.cdlja.weebsport.domain.Clothe;
import fr.cdlja.weebsport.domain.OrderLine;
import fr.cdlja.weebsport.domain.Stock;
import fr.cdlja.weebsport.domain.SubscribedClients;
import fr.cdlja.weebsport.repository.ClotheRepository;
import fr.cdlja.weebsport.repository.OrderLineRepository;
import fr.cdlja.weebsport.repository.StockRepository;
import fr.cdlja.weebsport.repository.SubscribedClientsRepository;
import fr.cdlja.weebsport.service.dto.FilterDTO;
import fr.cdlja.weebsport.service.dto.OrderDTO;
import fr.cdlja.weebsport.service.dto.OrderlineDTO;
import fr.cdlja.weebsport.service.dto.StockDTO;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
        OrderDTO basket = subscribedClientsService.getBasket(email);
        Long orderid = basket.getId();
        Pageable pageable = PageRequest.of(0, 10);
        Page<OrderLine> lines = orderLineRepository.getlines(orderid, pageable);
        for (OrderLine orderLine : lines) {
            Stock stock = orderLineRepository.getArticle(orderLine.getId());
            Object[][] res = stockRepository.readStock(stock.getId());
            if (res != null) {
                int quantity = (int) res[0][0];
                int version = (int) res[0][1];
                if (quantity == 0) {
                    throw new Exception("Stock quantity is zero");
                }
                Integer purchasequantity = orderLine.getQuantity();
                if (purchasequantity > quantity) {
                    throw new Exception("nb souhaité superieur à la quantité disponible");
                }
                Integer newquantity = quantity - purchasequantity;
                int rowsAffected = stockRepository.updateStock(newquantity, version, stock.getId());
                if (!(rowsAffected > 0)) {
                    throw new Exception("stock not available");
                }
            } else {
                throw new Exception("No stock found for ID: " + stock.getId());
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
            if (res != null) {
                int quantity = (int) res[0][0];
                int version = (int) res[0][1];
                if (quantity == 0) {
                    throw new Exception("Stock quantity is zero");
                }

                if (purchasequantity > quantity) {
                    throw new Exception("desired number greater than available quantity");
                }
                Integer newquantity = quantity - purchasequantity;
                //si ici on met version à O, c'est à dire une version inférieur à la dernière faites
                //donc comme si une commande à été validée depuis la lecture la requete echou et la commande est impossible
                int rowsAffected = stockRepository.updateStock(newquantity, version, stockDTO.getId());
                if (!(rowsAffected > 0)) {
                    throw new Exception("stock not available");
                }
            } else {
                throw new Exception("No stock found for ID: " + stockDTO.getId());
            }
        }
    }

    public Set<Clothe> search(String keyWord) {
        List<Stock> stocks = stockRepository.searchStockByKeyword(keyWord);
        Set<Clothe> clothes = new HashSet<>();
        for (Stock stock : stocks) {
            clothes.add(stock.getClothe());
        }
        List<Clothe> clothesFromRepo = clotheRepository.searchClotheByKeyword(keyWord);
        clothes.addAll(clothesFromRepo);
        return clothes;
    }

    public Set<Clothe> applyFilters(FilterDTO filters) {
        Set<Clothe> clothes = new HashSet<>();
        Set<Stock> stocks = Set.of();
        Set<Clothe> clothesTemp = Set.of();
        boolean firstFilter = true;

        if (filters.getSizes() != null) {
            stocks = new HashSet<>(stockRepository.getStocksBySize(filters.getSizes()));
            for (Stock s : stocks) {
                clothes.add(s.getClothe());
            }
            firstFilter = false;
        }

        if (filters.getColors() != null) {
            stocks = new HashSet<>(stockRepository.getStocksByColor(filters.getColors()));
            clothesTemp = new HashSet<>();
            for (Stock s : stocks) {
                clothesTemp.add(s.getClothe());
            }
            if (firstFilter) {
                clothes.addAll(clothesTemp);
                firstFilter = false;
            } else {
                clothes.retainAll(clothesTemp);
            }
        }

        if (filters.getPrices() != null) {
            Float minPrice = filters.getPrices().getMin();
            Float maxPrice = filters.getPrices().getMax();

            if (minPrice != null && maxPrice != null) {
                clothesTemp = new HashSet<>(clotheRepository.getClotheFilteredByPrice(minPrice, maxPrice));
            } else if (minPrice != null) {
                clothesTemp = new HashSet<>(clotheRepository.getClotheByMinPrice(minPrice));
            } else if (maxPrice != null) {
                clothesTemp = new HashSet<>(clotheRepository.getClotheByMaxPrice(maxPrice));
            } else {
                clothesTemp = new HashSet<>();
            }
            if (firstFilter) {
                clothes.addAll(clothesTemp);
                firstFilter = false;
            } else {
                clothes.retainAll(clothesTemp);
            }
        }

        if (filters.getGenders() != null) {
            clothesTemp = new HashSet<>(clotheRepository.findByGender(filters.getGenders()));
            if (firstFilter) {
                clothes.addAll(clothesTemp);
                firstFilter = false;
            } else {
                clothes.retainAll(clothesTemp);
            }
        }

        if (filters.getVideogameThemes() != null) {
            List<String> themes = filters.getVideogameThemes().stream().map(String::toUpperCase).toList();
            clothesTemp = new HashSet<>(clotheRepository.findByAnimeThemes(themes));
            if (firstFilter) {
                clothes.addAll(clothesTemp);
                firstFilter = false;
            } else {
                clothes.retainAll(clothesTemp);
            }
        }

        if (filters.getAnimeThemes() != null) {
            List<String> themes = filters.getAnimeThemes().stream().map(String::toUpperCase).toList();
            clothesTemp = new HashSet<>(clotheRepository.findByVideoGameThemes(themes));
            if (firstFilter) {
                clothes.addAll(clothesTemp);
            } else {
                clothes.retainAll(clothesTemp);
            }
        }
        return clothes;
    }
}
