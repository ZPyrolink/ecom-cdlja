package fr.cdlja.weebsport.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class StockTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Stock getStockSample1() {
        return new Stock().id(1L).quantity(1);
    }

    public static Stock getStockSample2() {
        return new Stock().id(2L).quantity(2);
    }

    public static Stock getStockRandomSampleGenerator() {
        return new Stock().id(longCount.incrementAndGet()).quantity(intCount.incrementAndGet());
    }
}
