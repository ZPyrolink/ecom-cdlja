package fr.cdlja.weebsport.repository;

import fr.cdlja.weebsport.domain.SubscribedClients;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SubscribedClients entity.
 *
 * When extending this class, extend SubscribedClientsRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface SubscribedClientsRepository
    extends SubscribedClientsRepositoryWithBagRelationships, JpaRepository<SubscribedClients, Long> {
    default Optional<SubscribedClients> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<SubscribedClients> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<SubscribedClients> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }

    @Query("SELECT sc FROM SubscribedClients sc WHERE sc.email = :email")
    Optional<SubscribedClients> findByEmail(@Param("email") String email);

    @Modifying
    @Query("UPDATE SubscribedClients c SET c.address = :newAddress WHERE c.id = :id")
    int updateClientAddress(@Param("id") Long id, @Param("newAddress") String newAddress);
}
