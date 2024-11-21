package fr.cdlja.weebsport.repository;

import fr.cdlja.weebsport.domain.Order;
import java.util.List;
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
    List<Order> getHistorique(@Param("clientId") Long clientId);
}
