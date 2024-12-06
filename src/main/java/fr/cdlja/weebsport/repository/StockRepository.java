package fr.cdlja.weebsport.repository;

import fr.cdlja.weebsport.domain.Clothe;
import fr.cdlja.weebsport.domain.Stock;
import fr.cdlja.weebsport.domain.enumeration.Color;
import fr.cdlja.weebsport.domain.enumeration.Size;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
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

    @Query("SELECT s.quantity, s.version FROM Stock s WHERE s.id= :stockID")
    Object[][] readStock(@Param("stockID") Long stockID);

    @Query("SELECT s.version FROM Stock s WHERE s.id= :stockID")
    Long readVersion(@Param("stockID") Long stockID);

    @Modifying
    @Query("UPDATE Stock s SET s.quantity=:quantity, s.version=: version+1 WHERE s.id = :id and s.version =:version ")
    int updateStock(@Param("quantity") Integer quantity, @Param("version") Integer version, @Param("id") Long id);

    @Query("SELECT s from Stock s WHERE s.size IN :sizes")
    List<Stock> getStocksBySize(@Param("size") List<Size> sizes);

    @Query("SELECT s FROM Stock s WHERE s.color IN :colors")
    List<Stock> getStocksByColor(@Param("color") List<Color> colors);

    @Query("SELECT s FROM Stock s WHERE " + "CAST(s.size AS String) LIKE %:keyword% OR " + "CAST(s.color AS String) LIKE %:keyword%")
    List<Stock> searchStockByKeyword(String keyword);

    List<Stock> findBySizeContains(@Param("keyword") String keyword);

    List<Stock> findByColorContains(@Param("keyword") String keyword);
}
