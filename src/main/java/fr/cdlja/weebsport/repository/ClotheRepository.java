package fr.cdlja.weebsport.repository;

import fr.cdlja.weebsport.domain.Clothe;
import fr.cdlja.weebsport.domain.enumeration.Category;
import fr.cdlja.weebsport.domain.enumeration.Gender;
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
    @Query("SELECT DISTINCT c, s.id FROM Stock s JOIN s.clothe c WHERE s.quantity > 0 order by s.id")
    Page<Object[]> findClotheWithQuantityGreaterThanZero(Pageable pageable);

    @Query("SELECT DISTINCT c.theme FROM Clothe c JOIN c.Categories cat WHERE cat = :category")
    List<String> findAllThemes(@Param("category") Category category);

    @Query(
        "SELECT DISTINCT c.theme FROM Clothe c JOIN c.Categories cat WHERE cat = :category AND LOWER(c.theme) LIKE  LOWER(CONCAT('%',:search,'%' )) "
    )
    List<String> findAllThemesWithSearch(@Param("category") Category category, @Param("search") String search);

    @Query("SELECT c FROM Clothe c WHERE c.price >= :price")
    List<Clothe> getClotheByMinPrice(@Param("price") Float price);

    @Query("SELECT c FROM Clothe c WHERE c.price <= :price")
    List<Clothe> getClotheByMaxPrice(@Param("price") Float price);

    @Query("SELECT c FROM Clothe c WHERE c.price >= :minPrice and c.price <= :maxPrice")
    List<Clothe> getClotheFilteredByPrice(@Param("minPrice") Float minPrice, @Param("maxPrice") Float maxPrice);

    @Query("SELECT c FROM Clothe c WHERE c.gender IN :genders")
    List<Clothe> findByGender(@Param("genders") List<Gender> genders);

    @Query("SELECT c FROM Clothe c WHERE UPPER(c.theme) IN :videoGameThemes")
    List<Clothe> findByVideoGameThemes(@Param("videoGameThemes") List<String> videoGameThemes);

    @Query("SELECT c FROM Clothe c WHERE UPPER(c.theme) IN :animeThemes")
    List<Clothe> findByAnimeThemes(@Param("animeThemes") List<String> animeThemes);

    @Query(
        "SELECT c FROM Clothe c WHERE " +
        "UPPER(CAST(c.theme AS String)) LIKE %:keyword% OR " +
        "UPPER(CAST(c.type AS String)) LIKE %:keyword% OR " +
        "UPPER(CAST(c.description AS String)) LIKE %:keyword%"
    )
    List<Clothe> searchClotheByKeyword(String keyword);
}
