package fr.cdlja.weebsport.repository;

import fr.cdlja.weebsport.domain.SubscribedClients;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class SubscribedClientsRepositoryWithBagRelationshipsImpl implements SubscribedClientsRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String SUBSCRIBEDCLIENTS_PARAMETER = "subscribedClients";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<SubscribedClients> fetchBagRelationships(Optional<SubscribedClients> subscribedClients) {
        return subscribedClients.map(this::fetchFavorises);
    }

    @Override
    public Page<SubscribedClients> fetchBagRelationships(Page<SubscribedClients> subscribedClients) {
        return new PageImpl<>(
            fetchBagRelationships(subscribedClients.getContent()),
            subscribedClients.getPageable(),
            subscribedClients.getTotalElements()
        );
    }

    @Override
    public List<SubscribedClients> fetchBagRelationships(List<SubscribedClients> subscribedClients) {
        return Optional.of(subscribedClients).map(this::fetchFavorises).orElse(Collections.emptyList());
    }

    SubscribedClients fetchFavorises(SubscribedClients result) {
        return entityManager
            .createQuery(
                "select subscribedClients from SubscribedClients subscribedClients left join fetch subscribedClients.favorises where subscribedClients.id = :id",
                SubscribedClients.class
            )
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<SubscribedClients> fetchFavorises(List<SubscribedClients> subscribedClients) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, subscribedClients.size()).forEach(index -> order.put(subscribedClients.get(index).getId(), index));
        List<SubscribedClients> result = entityManager
            .createQuery(
                "select subscribedClients from SubscribedClients subscribedClients left join fetch subscribedClients.favorises where subscribedClients in :subscribedClients",
                SubscribedClients.class
            )
            .setParameter(SUBSCRIBEDCLIENTS_PARAMETER, subscribedClients)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
