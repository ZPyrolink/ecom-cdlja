package fr.cdlja.weebsport.repository;

import fr.cdlja.weebsport.domain.Clothe;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Clothe entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClotheRepository extends JpaRepository<Clothe, Long> {}
