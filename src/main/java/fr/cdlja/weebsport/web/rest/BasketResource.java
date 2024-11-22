package fr.cdlja.weebsport.web.rest;

import fr.cdlja.weebsport.service.BasketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/basket")
@Transactional
public class BasketResource {

    private final BasketService basketService;

    public BasketResource(BasketService basketService) {
        this.basketService = basketService;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> ajouterArticle(@PathVariable(value = "id", required = false) final long articleId) {
        try {
            basketService.ajouterArticle(articleId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // 200 OK
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerArticle(@PathVariable(value = "id", required = false) final long articleId) {
        try {
            basketService.supprimerArticle(articleId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // 200 OK
        }
    }
}
