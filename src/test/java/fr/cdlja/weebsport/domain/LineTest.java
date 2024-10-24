package fr.cdlja.weebsport.domain;

import static fr.cdlja.weebsport.domain.LineTestSamples.*;
import static fr.cdlja.weebsport.domain.NoteTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import fr.cdlja.weebsport.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LineTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Line.class);
        Line line1 = getLineSample1();
        Line line2 = new Line();
        assertThat(line1).isNotEqualTo(line2);

        line2.setId(line1.getId());
        assertThat(line1).isEqualTo(line2);

        line2 = getLineSample2();
        assertThat(line1).isNotEqualTo(line2);
    }

    @Test
    void noteTest() {
        Line line = getLineRandomSampleGenerator();
        Note noteBack = getNoteRandomSampleGenerator();

        line.setNote(noteBack);
        assertThat(line.getNote()).isEqualTo(noteBack);

        line.note(null);
        assertThat(line.getNote()).isNull();
    }
}
