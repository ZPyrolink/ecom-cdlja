package fr.cdlja.weebsport.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class LineTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Line getLineSample1() {
        return new Line().id(1L).content("content1");
    }

    public static Line getLineSample2() {
        return new Line().id(2L).content("content2");
    }

    public static Line getLineRandomSampleGenerator() {
        return new Line().id(longCount.incrementAndGet()).content(UUID.randomUUID().toString());
    }
}
