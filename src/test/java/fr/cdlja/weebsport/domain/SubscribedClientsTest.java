package fr.cdlja.weebsport.domain;

import static fr.cdlja.weebsport.domain.ClotheTestSamples.*;
import static fr.cdlja.weebsport.domain.OrderTestSamples.*;
import static fr.cdlja.weebsport.domain.SubscribedClientsTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import fr.cdlja.weebsport.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class SubscribedClientsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SubscribedClients.class);
        SubscribedClients subscribedClients1 = getSubscribedClientsSample1();
        SubscribedClients subscribedClients2 = new SubscribedClients();
        assertThat(subscribedClients1).isNotEqualTo(subscribedClients2);

        subscribedClients2.setId(subscribedClients1.getId());
        assertThat(subscribedClients1).isEqualTo(subscribedClients2);

        subscribedClients2 = getSubscribedClientsSample2();
        assertThat(subscribedClients1).isNotEqualTo(subscribedClients2);
    }

    @Test
    void basketTest() {
        SubscribedClients subscribedClients = getSubscribedClientsRandomSampleGenerator();
        Order orderBack = getOrderRandomSampleGenerator();

        subscribedClients.setBasket(orderBack);
        assertThat(subscribedClients.getBasket()).isEqualTo(orderBack);

        subscribedClients.basket(null);
        assertThat(subscribedClients.getBasket()).isNull();
    }

    @Test
    void favorisTest() {
        SubscribedClients subscribedClients = getSubscribedClientsRandomSampleGenerator();
        Clothe clotheBack = getClotheRandomSampleGenerator();

        subscribedClients.addFavoris(clotheBack);
        assertThat(subscribedClients.getFavorises()).containsOnly(clotheBack);

        subscribedClients.removeFavoris(clotheBack);
        assertThat(subscribedClients.getFavorises()).doesNotContain(clotheBack);

        subscribedClients.favorises(new HashSet<>(Set.of(clotheBack)));
        assertThat(subscribedClients.getFavorises()).containsOnly(clotheBack);

        subscribedClients.setFavorises(new HashSet<>());
        assertThat(subscribedClients.getFavorises()).doesNotContain(clotheBack);
    }

    @Test
    void historiqueTest() {
        SubscribedClients subscribedClients = getSubscribedClientsRandomSampleGenerator();
        Order orderBack = getOrderRandomSampleGenerator();

        subscribedClients.addHistorique(orderBack);
        assertThat(subscribedClients.getHistoriques()).containsOnly(orderBack);
        assertThat(orderBack.getClient()).isEqualTo(subscribedClients);

        subscribedClients.removeHistorique(orderBack);
        assertThat(subscribedClients.getHistoriques()).doesNotContain(orderBack);
        assertThat(orderBack.getClient()).isNull();

        subscribedClients.historiques(new HashSet<>(Set.of(orderBack)));
        assertThat(subscribedClients.getHistoriques()).containsOnly(orderBack);
        assertThat(orderBack.getClient()).isEqualTo(subscribedClients);

        subscribedClients.setHistoriques(new HashSet<>());
        assertThat(subscribedClients.getHistoriques()).doesNotContain(orderBack);
        assertThat(orderBack.getClient()).isNull();
    }
}
