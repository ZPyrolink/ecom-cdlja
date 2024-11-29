package fr.cdlja.weebsport.repository;

import fr.cdlja.weebsport.domain.OrderLine;
import fr.cdlja.weebsport.domain.Stock;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the OrderLine entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderLineRepository extends JpaRepository<OrderLine, Long> {
    @Query("SELECT o FROM OrderLine o WHERE o.order.id= :orderId")
    Page<OrderLine> getlines(@Param("orderId") Long orderId, Pageable pageable);

    @Query("SELECT o.stock FROM OrderLine o WHERE o.id= :orderlineId")
    Stock getArticle(@Param("orderlineId") Long orderlineId);

    @Query("SELECT COALESCE(SUM (o.quantity),0) from OrderLine o Join o.order WHERE o.order.id= :orderid")
    Long getQuantity(@Param("orderid") Long orderid);
}
