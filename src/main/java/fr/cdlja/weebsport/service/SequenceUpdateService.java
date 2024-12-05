//package fr.cdlja.weebsport.service;
//
//import jakarta.annotation.PostConstruct;
//import jakarta.persistence.EntityManager;
//import org.springframework.context.ApplicationListener;
//import org.springframework.context.event.ContextRefreshedEvent;
//import org.springframework.transaction.annotation.Transactional;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import java.util.concurrent.TimeUnit;
//
//@Service
//public class SequenceUpdateService implements ApplicationListener<ContextRefreshedEvent> {
//
//    private final Logger log = LoggerFactory.getLogger(SequenceUpdateService.class);
//
//    @Value("${spring.datasource.url}")
//    private String dbUrl; // Facultatif, pour afficher l'URL de la base de données (utile pour debug)
//
//    private final EntityManager entityManager;
//
//    public SequenceUpdateService(EntityManager entityManager) {
//        this.entityManager = entityManager;
//    }
//
//    @PostConstruct
//    @Transactional
//    public void onApplicationEvent(ContextRefreshedEvent event) {
//        while (!isTableExist("jhi_user") || !isTableExist("subscribed_clients") || !isTableExist("order_line") || !isTableExist("jhi_order")) {
//            try {
//                TimeUnit.SECONDS.sleep(5);
//            } catch (InterruptedException e) {
//                throw new RuntimeException(e);
//            }
//        }
//        updateSequences();
//    }
//    public void updateSequences() {
//        updateSequence("jhi_user", "user_id_seq");
//        updateSequence("subscribed_clients", "client_id_seq");
//        updateSequence("order_line", "order_line_id_seq");
//        updateSequence("jhi_order", "order_id_seq");
//    }
//
//    public void updateSequence(String tableName, String sequenceName) {
//        log.info("Mise à jour des séquences de la base de données");
//        Long nextValue = 0L;
//        try {
//            boolean tableExists = (Boolean) entityManager.createNativeQuery(
//                    "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = :tableName)")
//                .setParameter("tableName", tableName)
//                .getSingleResult();
//
//            if (!tableExists) {
//                log.warn("La table '{}' n'existe pas. Aucun traitement effectué.", tableName);
//                return;
//            }
//            // Récupérer la valeur maximale de l'id dans la table
//            String maxIdQuery = String.format("SELECT COALESCE(MAX(id), 0) FROM %s", tableName);
//            Long maxId = ((Number) entityManager.createNativeQuery(maxIdQuery).getSingleResult()).longValue();
//
//
//            // Calculer la prochaine valeur de la séquence
//            nextValue = maxId + 1;
//
//            // Mettre à jour la séquence en utilisant `setval`
//            log.info("Before select on : {}", sequenceName);
//            String sql = String.format("SELECT setval('%s', %d)", sequenceName, nextValue);
//            entityManager.createNativeQuery(sql).executeUpdate();
//
//            log.info("Séquence '{}' mise à jour avec succès. Prochaine valeur : {}", sequenceName, nextValue);
//        } catch (Exception e) {
//            log.info("Séquence '{}' Error. Prochaine valeur : {}", sequenceName, nextValue);
//            log.error("Erreur lors de la mise à jour de la séquence: ", e);
//        }
//    }
//
//    private boolean isTableExist(String tableName) {
//        String query = "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = ?)";
//        Boolean result = (Boolean) entityManager.createNativeQuery(query)
//            .setParameter(1, tableName)
//            .getSingleResult();
//        return result != null && result;
//    }
//}
