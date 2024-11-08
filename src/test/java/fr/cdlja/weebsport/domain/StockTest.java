package fr.cdlja.weebsport.domain;

import static fr.cdlja.weebsport.domain.ClotheTestSamples.*;
import static fr.cdlja.weebsport.domain.StockTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import fr.cdlja.weebsport.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StockTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Stock.class);
        Stock stock1 = getStockSample1();
        Stock stock2 = new Stock();
        assertThat(stock1).isNotEqualTo(stock2);

        stock2.setId(stock1.getId());
        assertThat(stock1).isEqualTo(stock2);

        stock2 = getStockSample2();
        assertThat(stock1).isNotEqualTo(stock2);
    }

    @Test
    void clotheTest() {
        Stock stock = getStockRandomSampleGenerator();
        Clothe clotheBack = getClotheRandomSampleGenerator();

        stock.setClothe(clotheBack);
        assertThat(stock.getClothe()).isEqualTo(clotheBack);

        stock.clothe(null);
        assertThat(stock.getClothe()).isNull();
    }
}
