package fr.cdlja.weebsport.repository;

import fr.cdlja.weebsport.domain.Clothe;
import fr.cdlja.weebsport.domain.Stock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Clothe entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClotheRepository extends JpaRepository<Clothe, Long> {
    @Query("SELECT DISTINCT c, s.id FROM Stock s JOIN s.clothe c WHERE s.quantity > 0 order by s.id")
    Page<Object[]> findClotheWithQuantityGreaterThanZero(Pageable pageable);
}
