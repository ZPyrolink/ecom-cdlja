package fr.cdlja.weebsport.service;

import fr.cdlja.weebsport.domain.enumeration.Category;
import fr.cdlja.weebsport.repository.ClotheRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ClotheService {

    private static final Logger LOG = LoggerFactory.getLogger(ClotheService.class);
    public final ClotheRepository clotheRepository;

    public ClotheService(ClotheRepository clotheRepository) {
        this.clotheRepository = clotheRepository;
    }

    public List<String> getThemesByCategoryAndSearch(Category category, String search) {
        return clotheRepository.findAllThemesWithSearch(category, search);
    }
}
