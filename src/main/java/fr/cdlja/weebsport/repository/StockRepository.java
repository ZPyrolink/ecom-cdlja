package fr.cdlja.weebsport.repository;

import fr.cdlja.weebsport.domain.Clothe;
import fr.cdlja.weebsport.domain.Stock;
import fr.cdlja.weebsport.domain.enumeration.Color;
import fr.cdlja.weebsport.domain.enumeration.Size;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Stock entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    @Query("SELECT s.clothe FROM Stock s WHERE s.id= :artId")
    Clothe getClothe(@Param("artId") Long artId);

    @Query("SELECT s FROM Stock s WHERE s.quantity > 0")
    Page<Stock> findStocksWithQuantityGreaterThanZero(Pageable pageable);

    @Query("SELECT s.size FROM Stock s WHERE s.clothe.id = :clotheId AND s.color = :color AND s.quantity > 0")
    List<Size> findAvailableSizesByClotheIdAndColorId(@Param("clotheId") Long clotheId, @Param("color") Color color);

    @Query("SELECT s.color FROM Stock s WHERE s.clothe.id= :clotheId AND s.quantity > 0 ")
    List<Color> findAvailableColorsByClotheId(@Param("clotheId") Long clotheId);
}
