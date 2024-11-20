package fr.cdlja.weebsport.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class SubscribedClientsTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static SubscribedClients getSubscribedClientsSample1() {
        return new SubscribedClients().id(1L).email("email1").address("address1").bankCard("banckCard1").phone("phone1").points(1);
    }

    public static SubscribedClients getSubscribedClientsSample2() {
        return new SubscribedClients().id(2L).email("email2").address("address2").bankCard("banckCard2").phone("phone2").points(2);
    }

    public static SubscribedClients getSubscribedClientsRandomSampleGenerator() {
        return new SubscribedClients()
            .id(longCount.incrementAndGet())
            .email(UUID.randomUUID().toString())
            .address(UUID.randomUUID().toString())
            .bankCard(UUID.randomUUID().toString())
            .phone(UUID.randomUUID().toString())
            .points(intCount.incrementAndGet());
    }
}
