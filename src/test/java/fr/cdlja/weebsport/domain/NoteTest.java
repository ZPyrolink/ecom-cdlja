package fr.cdlja.weebsport.domain;

import static fr.cdlja.weebsport.domain.LineTestSamples.*;
import static fr.cdlja.weebsport.domain.NoteTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import fr.cdlja.weebsport.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class NoteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Note.class);
        Note note1 = getNoteSample1();
        Note note2 = new Note();
        assertThat(note1).isNotEqualTo(note2);

        note2.setId(note1.getId());
        assertThat(note1).isEqualTo(note2);

        note2 = getNoteSample2();
        assertThat(note1).isNotEqualTo(note2);
    }

    @Test
    void linesTest() {
        Note note = getNoteRandomSampleGenerator();
        Line lineBack = getLineRandomSampleGenerator();

        note.addLines(lineBack);
        assertThat(note.getLines()).containsOnly(lineBack);
        assertThat(lineBack.getNote()).isEqualTo(note);

        note.removeLines(lineBack);
        assertThat(note.getLines()).doesNotContain(lineBack);
        assertThat(lineBack.getNote()).isNull();

        note.lines(new HashSet<>(Set.of(lineBack)));
        assertThat(note.getLines()).containsOnly(lineBack);
        assertThat(lineBack.getNote()).isEqualTo(note);

        note.setLines(new HashSet<>());
        assertThat(note.getLines()).doesNotContain(lineBack);
        assertThat(lineBack.getNote()).isNull();
    }
}
