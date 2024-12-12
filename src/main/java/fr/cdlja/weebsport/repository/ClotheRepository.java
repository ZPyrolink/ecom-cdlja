package fr.cdlja.weebsport.repository;

import fr.cdlja.weebsport.domain.Clothe;
import fr.cdlja.weebsport.domain.enumeration.Category;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Clothe entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClotheRepository extends JpaRepository<Clothe, Long> {
    @Query("SELECT c FROM Clothe c JOIN Stock s ON c.id = s.clothe.id GROUP BY c HAVING SUM(s.quantity) > 0")
    Page<Clothe> findClotheWithQuantityGreaterThanZero(Pageable pageable);

    @Query("SELECT DISTINCT c.theme FROM Clothe c JOIN c.Categories cat WHERE cat = :category")
    List<String> findAllThemes(@Param("category") Category category);

    @Query(
        "SELECT DISTINCT c.theme FROM Clothe c JOIN c.Categories cat WHERE cat = :category AND LOWER(c.theme) LIKE  LOWER(CONCAT('%',:search,'%' )) "
    )
    List<String> findAllThemesWithSearch(@Param("category") Category category, @Param("search") String search);
}
