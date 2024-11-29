package fr.cdlja.weebsport.web.rest;

import fr.cdlja.weebsport.repository.UserRepository;
import fr.cdlja.weebsport.security.SecurityUtils;
import fr.cdlja.weebsport.service.BasketService;
import fr.cdlja.weebsport.service.SubscribedClientsService;
import fr.cdlja.weebsport.service.dto.OrderDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/basket")
@Transactional
public class BasketResource {

    private final BasketService basketService;
    private final UserRepository userRepository;
    private final SubscribedClientsService subscribedClientsService;

    public BasketResource(BasketService basketService, UserRepository userRepository, SubscribedClientsService subscribedClientsService) {
        this.basketService = basketService;
        this.userRepository = userRepository;
        this.subscribedClientsService = subscribedClientsService;
    }

    @GetMapping("")
    public ResponseEntity<OrderDTO> getPanier() throws Exception {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not logged in"));

        String userEmail = userRepository
            .findOneByLogin(userLogin)
            .orElseThrow(() -> new RuntimeException("User not found with login: " + userLogin))
            .getEmail();

        OrderDTO panierDTO = subscribedClientsService.getBasket(userEmail);

        return ResponseEntity.ok(panierDTO);
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> ajouterArticle(@PathVariable(value = "id", required = false) final long articleId) {
        try {
            basketService.ajouterArticle(articleId);
            return ResponseEntity.ok("Article ajouté avec succès");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimerArticle(@PathVariable(value = "id", required = false) final long articleId) {
        try {
            basketService.supprimerArticle(articleId);
            return ResponseEntity.ok("Article supprimé avec succès");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }
}
