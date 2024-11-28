package fr.cdlja.weebsport.domain;

import static fr.cdlja.weebsport.domain.OrderLineTestSamples.*;
import static fr.cdlja.weebsport.domain.OrderTestSamples.*;
import static fr.cdlja.weebsport.domain.StockTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import fr.cdlja.weebsport.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrderLineTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderLine.class);
        OrderLine orderLine1 = getOrderLineSample1();
        OrderLine orderLine2 = new OrderLine();
        assertThat(orderLine1).isNotEqualTo(orderLine2);

        orderLine2.setId(orderLine1.getId());
        assertThat(orderLine1).isEqualTo(orderLine2);

        orderLine2 = getOrderLineSample2();
        assertThat(orderLine1).isNotEqualTo(orderLine2);
    }

    @Test
    void orderTest() {
        OrderLine orderLine = getOrderLineRandomSampleGenerator();
        Order orderBack = getOrderRandomSampleGenerator();

        orderLine.setOrder(orderBack);
        assertThat(orderLine.getOrder()).isEqualTo(orderBack);

        orderLine.order(null);
        assertThat(orderLine.getOrder()).isNull();
    }

    @Test
    void stockTest() {
        OrderLine orderLine = getOrderLineRandomSampleGenerator();
        Stock stockBack = getStockRandomSampleGenerator();

        orderLine.setStock(stockBack);
        assertThat(orderLine.getStock()).isEqualTo(stockBack);

        orderLine.stock(null);
        assertThat(orderLine.getStock()).isNull();
    }
}
