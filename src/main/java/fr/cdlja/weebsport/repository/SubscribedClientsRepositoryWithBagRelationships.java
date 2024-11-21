package fr.cdlja.weebsport.repository;

import fr.cdlja.weebsport.domain.SubscribedClients;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface SubscribedClientsRepositoryWithBagRelationships {
    Optional<SubscribedClients> fetchBagRelationships(Optional<SubscribedClients> subscribedClients);

    List<SubscribedClients> fetchBagRelationships(List<SubscribedClients> subscribedClients);

    Page<SubscribedClients> fetchBagRelationships(Page<SubscribedClients> subscribedClients);
}
