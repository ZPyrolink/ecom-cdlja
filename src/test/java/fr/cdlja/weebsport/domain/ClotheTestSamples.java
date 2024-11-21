package fr.cdlja.weebsport.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ClotheTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Clothe getClotheSample1() {
        return new Clothe().id(1L).theme("theme1").description("description1");
    }

    public static Clothe getClotheSample2() {
        return new Clothe().id(2L).theme("theme2").description("description2");
    }

    public static Clothe getClotheRandomSampleGenerator() {
        return new Clothe().id(longCount.incrementAndGet()).theme(UUID.randomUUID().toString()).description(UUID.randomUUID().toString());
    }
}
