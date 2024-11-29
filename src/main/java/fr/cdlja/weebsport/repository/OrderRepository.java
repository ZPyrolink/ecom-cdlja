package fr.cdlja.weebsport.repository;

import fr.cdlja.weebsport.domain.Order;
import fr.cdlja.weebsport.domain.SubscribedClients;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Order entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o WHERE o.client.id= :clientId")
    Page<Order> getHistorique(@Param("clientId") Long clientId, Pageable pageable);

    @Modifying
    @Query("UPDATE Order o SET o.client = :subscribedClients WHERE o.id = :id")
    int updateClient(@Param("id") Long id, @Param("subscribedClients") SubscribedClients subscribedClients);
}
