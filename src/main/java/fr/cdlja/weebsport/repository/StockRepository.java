package fr.cdlja.weebsport.repository;

import fr.cdlja.weebsport.domain.Clothe;
import fr.cdlja.weebsport.domain.Stock;
import fr.cdlja.weebsport.domain.enumeration.Color;
import fr.cdlja.weebsport.domain.enumeration.Gender;
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

    @Query("select s from Stock s where s.clothe.id= :id and s.color= :color and s.size= :size and s.quantity>0")
    Stock idStockByColorAndSize(@Param("color") Color color, @Param("size") Size size, @Param("id") Long id);

    @Modifying
    @Query("UPDATE Stock s SET s.quantity=:quantity, s.version=: version+1 WHERE s.id = :id and s.version =:version ")
    int updateStock(@Param("quantity") Integer quantity, @Param("version") Integer version, @Param("id") Long id);

    @Query(
        "SELECT s from Stock s WHERE " +
        "(:keyword is NULL OR (" +
        "UPPER(CAST(s.size AS String)) LIKE %:keyword% OR " +
        "UPPER(CAST(s.color AS String)) LIKE %:keyword% OR " +
        "UPPER(CAST(s.clothe.theme AS String)) LIKE %:keyword% OR " +
        "UPPER(CAST(s.clothe.type AS String)) LIKE %:keyword% OR " +
        "UPPER(CAST(s.clothe.description AS String)) LIKE %:keyword%)) " +
        "AND (:sizes is NULL OR s.size IN :sizes) " +
        "AND (:colors is NULL OR s.color IN :colors) " +
        "AND (:minPrice is NULL OR s.clothe.price >= :minPrice) " +
        "AND (:maxPrice is NULL OR s.clothe.price <= :maxPrice) " +
        "AND (:genders is NULL OR s.clothe.gender IN :genders) " +
        "AND (:videoGameThemes is NULL OR UPPER(s.clothe.theme) IN :videoGameThemes) " +
        "AND (:animeThemes is NULL OR UPPER(s.clothe.theme) IN :animeThemes) "
    )
    Page<Stock> getStocksByFiltersAndSearch(
        @Param("sizes") List<Size> sizes,
        @Param("colors") List<Color> colors,
        @Param("minPrice") Float minPrice,
        @Param("maxPrice") Float maxPrice,
        @Param("genders") List<Gender> genders,
        @Param("videoGameThemes") List<String> videoGameThemes,
        @Param("animeThemes") List<String> animeThemes,
        String keyword,
        Pageable pageable
    );
}
