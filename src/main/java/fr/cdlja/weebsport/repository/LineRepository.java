package fr.cdlja.weebsport.repository;

import fr.cdlja.weebsport.domain.Line;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Line entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LineRepository extends JpaRepository<Line, Long> {
    @Query("select l from Line l where l.note.id = ?1")
    List<Line> ofNote(int noteId);
}
