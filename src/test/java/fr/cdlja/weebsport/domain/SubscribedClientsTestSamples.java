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
        return new SubscribedClients()
            .id(1L)
            .lastname("lastname1")
            .firstname("firstname1")
            .email("email1")
            .passworld("passworld1")
            .address("address1")
            .banckCard("banckCard1")
            .phone("phone1")
            .points(1);
    }

    public static SubscribedClients getSubscribedClientsSample2() {
        return new SubscribedClients()
            .id(2L)
            .lastname("lastname2")
            .firstname("firstname2")
            .email("email2")
            .passworld("passworld2")
            .address("address2")
            .banckCard("banckCard2")
            .phone("phone2")
            .points(2);
    }

    public static SubscribedClients getSubscribedClientsRandomSampleGenerator() {
        return new SubscribedClients()
            .id(longCount.incrementAndGet())
            .lastname(UUID.randomUUID().toString())
            .firstname(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .passworld(UUID.randomUUID().toString())
            .address(UUID.randomUUID().toString())
            .banckCard(UUID.randomUUID().toString())
            .phone(UUID.randomUUID().toString())
            .points(intCount.incrementAndGet());
    }
}
