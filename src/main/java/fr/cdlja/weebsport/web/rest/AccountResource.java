package fr.cdlja.weebsport.web.rest;

import fr.cdlja.weebsport.config.Constants;
import fr.cdlja.weebsport.domain.Order;
import fr.cdlja.weebsport.domain.SubscribedClients;
import fr.cdlja.weebsport.domain.User;
import fr.cdlja.weebsport.domain.enumeration.Status;
import fr.cdlja.weebsport.repository.OrderRepository;
import fr.cdlja.weebsport.repository.SubscribedClientsRepository;
import fr.cdlja.weebsport.repository.UserRepository;
import fr.cdlja.weebsport.security.AuthoritiesConstants;
import fr.cdlja.weebsport.security.SecurityUtils;
import fr.cdlja.weebsport.service.BasketService;
import fr.cdlja.weebsport.service.MailService;
import fr.cdlja.weebsport.service.SubscribedClientsService;
import fr.cdlja.weebsport.service.UserService;
import fr.cdlja.weebsport.service.dto.*;
import fr.cdlja.weebsport.web.rest.errors.*;
import fr.cdlja.weebsport.web.rest.vm.KeyAndPasswordVM;
import fr.cdlja.weebsport.web.rest.vm.ManagedUserVM;
import fr.cdlja.weebsport.web.rest.vm.RegisterAccountVM;
import io.undertow.util.BadRequestException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import java.io.Console;
import java.util.*;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
public class AccountResource {

    private final SubscribedClientsService subscribedClientsService;

    private static class AccountResourceException extends RuntimeException {

        private AccountResourceException(String message) {
            super(message);
        }
    }

    private static final Logger LOG = LoggerFactory.getLogger(AccountResource.class);

    private final UserRepository userRepository;

    private final UserService userService;

    private final MailService mailService;

    private final OrderRepository orderRepository;

    private final BasketService basketService;

    public AccountResource(
        UserRepository userRepository,
        SubscribedClientsRepository subscribedClientsRepository,
        UserService userService,
        MailService mailService,
        SubscribedClientsService subscribedClientsService,
        OrderRepository OrderRepository,
        BasketService basketService
    ) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.mailService = mailService;
        this.subscribedClientsService = subscribedClientsService;
        this.orderRepository = OrderRepository;
        this.basketService = basketService;
    }

    // Logique métier pour créer les entités User et ClientAbonne et panié asso
    @PostMapping("/client/signin")
    @ResponseStatus(HttpStatus.CREATED)
    public void createClient(@Valid @RequestBody RegisterAccountVM registerAccountVM) throws Exception {
        // Accès aux données de l'utilisateur
        ManagedUserVM userm = registerAccountVM.getManagedUser();

        // Accès aux données du client abonné
        SubscribedClientDTO clientAbonned = registerAccountVM.getSubscribedClient();
        if (isPasswordLengthInvalid(userm.getPassword())) {
            throw new InvalidPasswordException();
        }
        User user;
        try {
            user = userService.registerUser(userm, userm.getPassword());
            if (user == null) {
                throw new RuntimeException("Erreur lors de la création de l'utilisateur. BOKI");
            }
        } catch (Exception e) {
            // Log the error and throw a specific exception or return a custom responses
            throw new RuntimeException("Create User Exception catch" + e);
        }
        try {
            subscribedClientsService.createClientWithBasket(user, clientAbonned);
        } catch (Exception e) {
            throw new RuntimeException("Create Client Exception catch" + e);
        }
    }

    @GetMapping("/client")
    public ResponseEntity<ClientWhithAdminDTO> getConnectClient() throws Exception {
        AdminUserDTO adminUserDTO = userService
            .getUserWithAuthorities()
            .map(AdminUserDTO::new)
            .orElseThrow(() -> new AccountResourceException("User could not be found"));
        LOG.info("User: {}", adminUserDTO);
        SubscribedClientDTO subscribedClientDTO = subscribedClientsService.getClientByEmail(adminUserDTO.getEmail());
        LOG.info("clientabonned: {}", subscribedClientDTO);
        OrderDTO basketDTO = subscribedClientsService.getBasket(adminUserDTO.getEmail());
        LOG.info("basketDTO: {}", basketDTO);
        List<OrderDTO> historique = subscribedClientsService.getHistorique(adminUserDTO.getEmail());
        LOG.info("historique: {}", historique);
        ClientWhithAdminDTO clientWhithAdminDTO = new ClientWhithAdminDTO(subscribedClientDTO, adminUserDTO, basketDTO, historique);

        return ResponseEntity.ok(clientWhithAdminDTO);
    }

    @GetMapping("/client/basket")
    public ResponseEntity<OrderDTO> getClientBasket() throws Exception {
        // Récupérer l'utilisateur connecté
        AdminUserDTO adminUserDTO = userService
            .getUserWithAuthorities()
            .map(AdminUserDTO::new)
            .orElseThrow(() -> new AccountResourceException("User could not be found"));
        LOG.info("User: {}", adminUserDTO);

        // Récupérer le panier du client connecté
        OrderDTO basketDTO = subscribedClientsService.getBasket(adminUserDTO.getEmail());
        LOG.info("Basket: {}", basketDTO);

        return ResponseEntity.ok(basketDTO);
    }

    @GetMapping("/client/basket/count")
    public ResponseEntity<Integer> getClientBasketCount() throws Exception {
        AdminUserDTO adminUserDTO = userService
            .getUserWithAuthorities()
            .map(AdminUserDTO::new)
            .orElseThrow(() -> new AccountResourceException("User could not be found"));
        LOG.info("User: {}", adminUserDTO);
        OrderDTO basketDTO = subscribedClientsService.getBasket(adminUserDTO.getEmail());
        Integer nbarticles = basketService.countnbArticles(basketDTO);
        return nbarticles;
    }

    /**
     * {@code POST  /register} : register the user.
     *
     * @param managedUserVM the managed user View Model.
     * @throws InvalidPasswordException {@code 400 (Bad Request)} if the password is incorrect.
     * @throws EmailAlreadyUsedException {@code 400 (Bad Request)} if the email is already used.
     * @throws LoginAlreadyUsedException {@code 400 (Bad Request)} if the login is already used.
     */
    //enregistre un nouveau client lors de la créassion de compte
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerAccount(@Valid @RequestBody ManagedUserVM managedUserVM) {
        if (isPasswordLengthInvalid(managedUserVM.getPassword())) {
            throw new InvalidPasswordException();
        }
        User user = userService.registerUser(managedUserVM, managedUserVM.getPassword());
        mailService.sendActivationEmail(user);
    }

    //on active par défaut donc non used
    /**
     * {@code GET  /activate} : activate the registered user.
     *
     * @param key the activation key.
     * @throws RuntimeException {@code 500 (Internal Server Error)} if the user couldn't be activated.
     */
    @GetMapping("/activate")
    public void activateAccount(@RequestParam(value = "key") String key) {
        Optional<User> user = userService.activateRegistration(key);
        if (!user.isPresent()) {
            throw new AccountResourceException("No user was found for this activation key");
        }
    }

    /**
     * {@code GET  /account} : get the current user.
     *
     * @return the current user.
     * @throws RuntimeException {@code 500 (Internal Server Error)} if the user couldn't be returned.
     */
    //recupère info user courant et ses authorités
    @GetMapping("/account")
    public AdminUserDTO getAccount() {
        return userService
            .getUserWithAuthorities()
            .map(AdminUserDTO::new)
            .orElseThrow(() -> new AccountResourceException("User could not be found"));
    }

    /**
     * {@code POST  /account} : update the current user information.
     *
     * @param userDTO the current user information.
     * @throws EmailAlreadyUsedException {@code 400 (Bad Request)} if the email is already used.
     * @throws RuntimeException {@code 500 (Internal Server Error)} if the user login wasn't found.
     */
    @PostMapping("/account")
    public void saveAccount(@Valid @RequestBody AdminUserDTO userDTO) {
        String userLogin = SecurityUtils.getCurrentUserLogin()
            .orElseThrow(() -> new AccountResourceException("Current user login not found"));
        Optional<User> existingUser = userRepository.findOneByEmailIgnoreCase(userDTO.getEmail());
        if (existingUser.isPresent() && (!existingUser.orElseThrow().getLogin().equalsIgnoreCase(userLogin))) {
            throw new EmailAlreadyUsedException();
        }
        Optional<User> user = userRepository.findOneByLogin(userLogin);
        if (!user.isPresent()) {
            throw new AccountResourceException("User could not be found");
        }
        userService.updateUser(
            userDTO.getFirstName(),
            userDTO.getLastName(),
            userDTO.getEmail(),
            userDTO.getLangKey(),
            userDTO.getImageUrl()
        );
    }

    //on ne veut pas toucher aux mdp donc non used
    /**
     * {@code POST  /account/change-password} : changes the current user's password.
     *
     * @param passwordChangeDto current and new password.
     * @throws InvalidPasswordException {@code 400 (Bad Request)} if the new password is incorrect.
     */
    @PostMapping(path = "/account/change-password")
    public void changePassword(@RequestBody PasswordChangeDTO passwordChangeDto) {
        if (isPasswordLengthInvalid(passwordChangeDto.getNewPassword())) {
            throw new InvalidPasswordException();
        }
        userService.changePassword(passwordChangeDto.getCurrentPassword(), passwordChangeDto.getNewPassword());
    }

    /**
     * {@code POST   /account/reset-password/init} : Send an email to reset the password of the user.
     *
     * @param mail the mail of the user.
     */
    @PostMapping(path = "/account/reset-password/init")
    public void requestPasswordReset(@RequestBody String mail) {
        Optional<User> user = userService.requestPasswordReset(mail);
        if (user.isPresent()) {
            mailService.sendPasswordResetMail(user.orElseThrow());
        } else {
            // Pretend the request has been successful to prevent checking which emails really exist
            // but log that an invalid attempt has been made
            LOG.warn("Password reset requested for non existing mail");
        }
    }

    /**
     * {@code POST   /account/reset-password/finish} : Finish to reset the password of the user.
     *
     * @param keyAndPassword the generated key and the new password.
     * @throws InvalidPasswordException {@code 400 (Bad Request)} if the password is incorrect.
     * @throws RuntimeException {@code 500 (Internal Server Error)} if the password could not be reset.
     */
    @PostMapping(path = "/account/reset-password/finish")
    public void finishPasswordReset(@RequestBody KeyAndPasswordVM keyAndPassword) {
        if (isPasswordLengthInvalid(keyAndPassword.getNewPassword())) {
            throw new InvalidPasswordException();
        }
        Optional<User> user = userService.completePasswordReset(keyAndPassword.getNewPassword(), keyAndPassword.getKey());

        if (!user.isPresent()) {
            throw new AccountResourceException("No user was found for this reset key");
        }
    }

    private static boolean isPasswordLengthInvalid(String password) {
        return (
            StringUtils.isEmpty(password) ||
            password.length() < ManagedUserVM.PASSWORD_MIN_LENGTH ||
            password.length() > ManagedUserVM.PASSWORD_MAX_LENGTH
        );
    }
}
