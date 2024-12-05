package fr.cdlja.weebsport.service;

import fr.cdlja.weebsport.domain.Clothe;
import fr.cdlja.weebsport.domain.Stock;
import fr.cdlja.weebsport.repository.ClotheRepository;
import fr.cdlja.weebsport.repository.StockRepository;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class StockService {

    private final StockRepository stockRepository;

    private final ClotheRepository clotheRepository;

    public StockService(StockRepository stockRepository, ClotheRepository clotheRepository) {
        this.stockRepository = stockRepository;
        this.clotheRepository = clotheRepository;
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
}
