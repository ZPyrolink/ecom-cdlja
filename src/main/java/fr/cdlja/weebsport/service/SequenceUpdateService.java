package fr.cdlja.weebsport.service;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SequenceUpdateService {

    private final Logger log = LoggerFactory.getLogger(SequenceUpdateService.class);

    @Value("${spring.datasource.url}")
    private String dbUrl; // Facultatif, pour afficher l'URL de la base de données (utile pour debug)

    private final EntityManager entityManager;

    public SequenceUpdateService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @PostConstruct
    @Transactional
    public void updateSequences() {
        updateSequence("jhi_user", "user_id_seq");
        updateSequence("subscribed_clients", "client_id_seq");
        updateSequence("order_line", "order_line_id_seq");
        updateSequence("jhi_order", "order_id_seq");
    }

    public void updateSequence(String tableName, String sequenceName) {
        log.info("Mise à jour des séquences de la base de données");
        Long nextValue = -1L;
        try {
            // Récupérer la valeur maximale de l'id dans la table
            String maxIdQuery = String.format("SELECT COALESCE(MAX(id), 0) FROM %s", tableName);
            Long maxId = ((Number) entityManager.createNativeQuery(maxIdQuery).getSingleResult()).longValue();

            if (maxId == 0) {
                log.info("Table '{}' vide. Aucune mise à jour nécessaire.", tableName);
                return;
            }

            // Calculer la prochaine valeur de la séquence
            nextValue = maxId + 1;

            // Mettre à jour la séquence en utilisant `setval`
            String sql = String.format("SELECT setval('%s', %d)", sequenceName, nextValue);
            entityManager.createNativeQuery(sql).executeUpdate();

            log.info("Séquence '{}' mise à jour avec succès. Prochaine valeur : {}", sequenceName, nextValue);
        } catch (Exception e) {
            log.info("Séquence '{}' Error. Prochaine valeur : {}", sequenceName, nextValue);
            log.error("Erreur lors de la mise à jour de la séquence: ", e);
        }
    }
}
