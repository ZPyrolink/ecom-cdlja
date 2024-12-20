package fr.cdlja.weebsport.domain;

import static fr.cdlja.weebsport.domain.ClotheTestSamples.*;
import static fr.cdlja.weebsport.domain.SubscribedClientsTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import fr.cdlja.weebsport.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ClotheTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Clothe.class);
        Clothe clothe1 = getClotheSample1();
        Clothe clothe2 = new Clothe();
        assertThat(clothe1).isNotEqualTo(clothe2);

        clothe2.setId(clothe1.getId());
        assertThat(clothe1).isEqualTo(clothe2);

        clothe2 = getClotheSample2();
        assertThat(clothe1).isNotEqualTo(clothe2);
    }
}
