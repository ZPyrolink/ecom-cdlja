package fr.cdlja.weebsport.domain;

import static fr.cdlja.weebsport.domain.OrderLineTestSamples.*;
import static fr.cdlja.weebsport.domain.OrderTestSamples.*;
import static fr.cdlja.weebsport.domain.SubscribedClientsTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import fr.cdlja.weebsport.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class OrderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Order.class);
        Order order1 = getOrderSample1();
        Order order2 = new Order();
        assertThat(order1).isNotEqualTo(order2);

        order2.setId(order1.getId());
        assertThat(order1).isEqualTo(order2);

        order2 = getOrderSample2();
        assertThat(order1).isNotEqualTo(order2);
    }

    @Test
    void clientTest() {
        Order order = getOrderRandomSampleGenerator();
        SubscribedClients subscribedClientsBack = getSubscribedClientsRandomSampleGenerator();

        order.setClient(subscribedClientsBack);
        assertThat(order.getClient()).isEqualTo(subscribedClientsBack);

        order.client(null);
        assertThat(order.getClient()).isNull();
    }

    @Test
    void orderlineTest() {
        Order order = getOrderRandomSampleGenerator();
        OrderLine orderLineBack = getOrderLineRandomSampleGenerator();

        order.addOrderline(orderLineBack);
        assertThat(order.getOrderlines()).containsOnly(orderLineBack);
        assertThat(orderLineBack.getOrder()).isEqualTo(order);

        order.removeOrderline(orderLineBack);
        assertThat(order.getOrderlines()).doesNotContain(orderLineBack);
        assertThat(orderLineBack.getOrder()).isNull();

        order.orderlines(new HashSet<>(Set.of(orderLineBack)));
        assertThat(order.getOrderlines()).containsOnly(orderLineBack);
        assertThat(orderLineBack.getOrder()).isEqualTo(order);

        order.setOrderlines(new HashSet<>());
        assertThat(order.getOrderlines()).doesNotContain(orderLineBack);
        assertThat(orderLineBack.getOrder()).isNull();
    }

    @Test
    void subscribedClientsTest() {
        Order order = getOrderRandomSampleGenerator();
        SubscribedClients subscribedClientsBack = getSubscribedClientsRandomSampleGenerator();

        order.setSubscribedClients(subscribedClientsBack);
        assertThat(order.getSubscribedClients()).isEqualTo(subscribedClientsBack);
        assertThat(subscribedClientsBack.getBasket()).isEqualTo(order);

        order.subscribedClients(null);
        assertThat(order.getSubscribedClients()).isNull();
        assertThat(subscribedClientsBack.getBasket()).isNull();
    }
}
