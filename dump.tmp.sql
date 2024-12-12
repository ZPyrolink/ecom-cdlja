-- H2 2.2.224; 
SET DB_CLOSE_DELAY -1;         
;              
CREATE USER IF NOT EXISTS "WEEBSPORT" SALT 'af466fc5b9b61a45' HASH 'dc215b06fba0c3ce8967d603dd280d7fad4aeb7d8c4992b2cbd06389f7fe0275' ADMIN;   
CREATE SEQUENCE "PUBLIC"."CLIENT_ID_SEQ" START WITH 1 INCREMENT BY 50;         
CREATE SEQUENCE "PUBLIC"."CLOTHE_SEQUENCE_GENERATOR" START WITH 1 INCREMENT BY 50;             
CREATE SEQUENCE "PUBLIC"."ORDER_ID_SEQ" START WITH 1 INCREMENT BY 50;          
CREATE SEQUENCE "PUBLIC"."ORDER_LINE_ID_SEQ" START WITH 1 INCREMENT BY 50;     
CREATE SEQUENCE "PUBLIC"."SEQUENCE_GENERATOR" START WITH 1050 INCREMENT BY 50; 
CREATE SEQUENCE "PUBLIC"."STOCK_SEQUENCE_GENERATOR" START WITH 1 INCREMENT BY 50;              
CREATE SEQUENCE "PUBLIC"."USER_ID_SEQ" START WITH 1 INCREMENT BY 50;           
CREATE MEMORY TABLE "PUBLIC"."DATABASECHANGELOG"(
    "ID" CHARACTER VARYING(255) NOT NULL,
    "AUTHOR" CHARACTER VARYING(255) NOT NULL,
    "FILENAME" CHARACTER VARYING(255) NOT NULL,
    "DATEEXECUTED" TIMESTAMP NOT NULL,
    "ORDEREXECUTED" INTEGER NOT NULL,
    "EXECTYPE" CHARACTER VARYING(10) NOT NULL,
    "MD5SUM" CHARACTER VARYING(35),
    "DESCRIPTION" CHARACTER VARYING(255),
    "COMMENTS" CHARACTER VARYING(255),
    "TAG" CHARACTER VARYING(255),
    "LIQUIBASE" CHARACTER VARYING(20),
    "CONTEXTS" CHARACTER VARYING(255),
    "LABELS" CHARACTER VARYING(255),
    "DEPLOYMENT_ID" CHARACTER VARYING(10)
);   
-- 20 +/- SELECT COUNT(*) FROM PUBLIC.DATABASECHANGELOG;       
INSERT INTO "PUBLIC"."DATABASECHANGELOG" VALUES
('00000000000000', 'jhipster', 'config/liquibase/changelog/00000000000000_initial_schema.xml', TIMESTAMP '2024-12-12 16:41:17.341789', 1, 'EXECUTED', '9:b6b4a3e0d2a6d7f1e5139675af65d7b0', 'createSequence sequenceName=sequence_generator', '', NULL, '4.27.0', NULL, NULL, '4018077312'),
('00000000000001', 'jhipster', 'config/liquibase/changelog/00000000000000_initial_schema.xml', TIMESTAMP '2024-12-12 16:41:17.353201', 2, 'EXECUTED', '9:39b63e0a7ad29cf93d03f3645ed27276', 'createTable tableName=jhi_user; createTable tableName=jhi_authority; createTable tableName=jhi_user_authority; addPrimaryKey tableName=jhi_user_authority; addForeignKeyConstraint baseTableName=jhi_user_authority, constraintName=fk_authority_name, ...', '', NULL, '4.27.0', NULL, NULL, '4018077312'),
('20241107152828-1', 'jhipster', 'config/liquibase/changelog/20241107152828_added_entity_Clothe.xml', TIMESTAMP '2024-12-12 16:41:17.355401', 3, 'EXECUTED', '9:7293bb3884679b282b8aec25a9f02d26', 'createTable tableName=clothe', '', NULL, '4.27.0', NULL, NULL, '4018077312'),
('20241107152828-1-data', 'jhipster', 'config/liquibase/changelog/20241107152828_added_entity_Clothe.xml', TIMESTAMP '2024-12-12 16:41:17.381488', 4, 'EXECUTED', '9:9e3673205959acc824e2d4bc58a82e45', 'loadData tableName=clothe', '', NULL, '4.27.0', 'faker', NULL, '4018077312'),
('20241107152828-1', 'jhipster', 'config/liquibase/changelog/20241107152828_added_entity_Clothe_categories.xml', TIMESTAMP '2024-12-12 16:41:17.383484', 5, 'EXECUTED', '9:db52fc2d93f673bac62164912989c80e', 'createTable tableName=clothe_categories', '', NULL, '4.27.0', NULL, NULL, '4018077312'),
('20241107152828-1-data', 'jhipster', 'config/liquibase/changelog/20241107152828_added_entity_Clothe_categories.xml', TIMESTAMP '2024-12-12 16:41:17.391295', 6, 'EXECUTED', '9:679cd31191e103e37c4dcc66f001220a', 'loadData tableName=clothe_categories', '', NULL, '4.27.0', 'faker', NULL, '4018077312'),
('20241107152829-1', 'jhipster', 'config/liquibase/changelog/20241107152828_added_entity_Article_images.xml', TIMESTAMP '2024-12-12 16:41:17.393693', 7, 'EXECUTED', '9:34ff8dc3fae8cdf84c89b7d15b516067', 'createTable tableName=article_images', '', NULL, '4.27.0', NULL, NULL, '4018077312'),
('20241107152829-1-data', 'jhipster', 'config/liquibase/changelog/20241107152828_added_entity_Article_images.xml', TIMESTAMP '2024-12-12 16:41:17.399016', 8, 'EXECUTED', '9:67d0faaac415cbe8f621ec54bf61bb50', 'loadData tableName=article_images', '', NULL, '4.27.0', 'faker', NULL, '4018077312'),
('20241107152829-1', 'jhipster', 'config/liquibase/changelog/20241107152829_added_entity_Stock.xml', TIMESTAMP '2024-12-12 16:41:17.404308', 9, 'EXECUTED', '9:47930e609a1cee6192f3612b2a40ed82', 'createTable tableName=stock', '', NULL, '4.27.0', NULL, NULL, '4018077312'),
('20241107152829-1-data', 'jhipster', 'config/liquibase/changelog/20241107152829_added_entity_Stock.xml', TIMESTAMP '2024-12-12 16:41:17.444155', 10, 'EXECUTED', '9:eb1925680f17c68f78bdede4cb0cc1d2', 'loadData tableName=stock', '', NULL, '4.27.0', 'faker', NULL, '4018077312'),
('20241107152830-1', 'jhipster', 'config/liquibase/changelog/20241107152830_added_entity_OrderLine.xml', TIMESTAMP '2024-12-12 16:41:17.452391', 11, 'EXECUTED', '9:5cbf6bbc7389d9e1515eea698bf72999', 'createTable tableName=order_line', '', NULL, '4.27.0', NULL, NULL, '4018077312'),
('20241107152831-1', 'jhipster', 'config/liquibase/changelog/20241107152831_added_entity_Order.xml', TIMESTAMP '2024-12-12 16:41:17.45504', 12, 'EXECUTED', '9:b67dfce50342758b9bf98d71568884ac', 'createTable tableName=jhi_order', '', NULL, '4.27.0', NULL, NULL, '4018077312'),
('20241107152832-1', 'jhipster', 'config/liquibase/changelog/20241107152832_added_entity_SubscribedClients.xml', TIMESTAMP '2024-12-12 16:41:17.459851', 13, 'EXECUTED', '9:53b47f39ff9162987f7e78cc3e2e01d0', 'createTable tableName=subscribed_clients', '', NULL, '4.27.0', NULL, NULL, '4018077312'),
('20241107152832-1-relations', 'jhipster', 'config/liquibase/changelog/20241107152832_added_entity_SubscribedClients.xml', TIMESTAMP '2024-12-12 16:41:17.462161', 14, 'EXECUTED', '9:2729c4973e19ad4280a6fe7dcaa79e5f', 'createTable tableName=rel_subscribed_clients__favoris; addPrimaryKey tableName=rel_subscribed_clients__favoris', '', NULL, '4.27.0', NULL, NULL, '4018077312');           
INSERT INTO "PUBLIC"."DATABASECHANGELOG" VALUES
('20241107152829-2', 'jhipster', 'config/liquibase/changelog/20241107152829_added_entity_constraints_Stock.xml', TIMESTAMP '2024-12-12 16:41:17.467305', 15, 'EXECUTED', '9:05a528938d7fb18d0d283efdf2ee8390', 'addForeignKeyConstraint baseTableName=stock, constraintName=fk_stock__clothe_id, referencedTableName=clothe', '', NULL, '4.27.0', NULL, NULL, '4018077312'),
('20241107152829-2', 'jhipster', 'config/liquibase/changelog/20241107152829_added_entity_constraints_Clothe_categories.xml', TIMESTAMP '2024-12-12 16:41:17.469186', 16, 'EXECUTED', '9:a9bde6c3bce54b580cbf541f60ca1337', 'addForeignKeyConstraint baseTableName=clothe_categories, constraintName=fk_categories__clothe_id, referencedTableName=clothe', '', NULL, '4.27.0', NULL, NULL, '4018077312'),
('20241107152831-2', 'jhipster', 'config/liquibase/changelog/20241107152829_added_entity_constraints_Article_images.xml', TIMESTAMP '2024-12-12 16:41:17.470808', 17, 'EXECUTED', '9:c492844f0a7b9d089bce157890d36b57', 'addForeignKeyConstraint baseTableName=article_images, constraintName=fk_image__client_id, referencedTableName=stock', '', NULL, '4.27.0', NULL, NULL, '4018077312'),
('20241107152830-2', 'jhipster', 'config/liquibase/changelog/20241107152830_added_entity_constraints_OrderLine.xml', TIMESTAMP '2024-12-12 16:41:17.473211', 18, 'EXECUTED', '9:c64cc3ef80a9adb754cc3ba9ebd56214', 'addForeignKeyConstraint baseTableName=order_line, constraintName=fk_order_line__order_id, referencedTableName=jhi_order; addForeignKeyConstraint baseTableName=order_line, constraintName=fk_order_line__stock_id, referencedTableName=stock', '', NULL, '4.27.0', NULL, NULL, '4018077312'),
('20241107152831-2', 'jhipster', 'config/liquibase/changelog/20241107152831_added_entity_constraints_Order.xml', TIMESTAMP '2024-12-12 16:41:17.474801', 19, 'EXECUTED', '9:da591c5f15c8fa3744139b73b871dc80', 'addForeignKeyConstraint baseTableName=jhi_order, constraintName=fk_jhi_order__client_id, referencedTableName=subscribed_clients', '', NULL, '4.27.0', NULL, NULL, '4018077312'),
('20241107152832-2', 'jhipster', 'config/liquibase/changelog/20241107152832_added_entity_constraints_SubscribedClients.xml', TIMESTAMP '2024-12-12 16:41:17.479207', 20, 'EXECUTED', '9:1851413ab3f268f7e0550ec08f5b605e', 'addForeignKeyConstraint baseTableName=subscribed_clients, constraintName=fk_subscribed_clients__basket_id, referencedTableName=jhi_order; addForeignKeyConstraint baseTableName=rel_subscribed_clients__favoris, constraintName=fk_rel_subscribed_clien...', '', NULL, '4.27.0', NULL, NULL, '4018077312');
CREATE MEMORY TABLE "PUBLIC"."DATABASECHANGELOGLOCK"(
    "ID" INTEGER NOT NULL,
    "LOCKED" BOOLEAN NOT NULL,
    "LOCKGRANTED" TIMESTAMP,
    "LOCKEDBY" CHARACTER VARYING(255)
);          
ALTER TABLE "PUBLIC"."DATABASECHANGELOGLOCK" ADD CONSTRAINT "PUBLIC"."PK_DATABASECHANGELOGLOCK" PRIMARY KEY("ID");             
-- 1 +/- SELECT COUNT(*) FROM PUBLIC.DATABASECHANGELOGLOCK;    
INSERT INTO "PUBLIC"."DATABASECHANGELOGLOCK" VALUES
(1, FALSE, NULL, NULL);    
CREATE MEMORY TABLE "PUBLIC"."JHI_USER"(
    "ID" BIGINT NOT NULL,
    "LOGIN" CHARACTER VARYING(50) NOT NULL,
    "PASSWORD_HASH" CHARACTER VARYING(60) NOT NULL,
    "FIRST_NAME" CHARACTER VARYING(50),
    "LAST_NAME" CHARACTER VARYING(50),
    "EMAIL" CHARACTER VARYING(254) NOT NULL,
    "IMAGE_URL" CHARACTER VARYING(256),
    "ACTIVATED" BOOLEAN NOT NULL,
    "LANG_KEY" CHARACTER VARYING(10),
    "ACTIVATION_KEY" CHARACTER VARYING(20),
    "RESET_KEY" CHARACTER VARYING(20),
    "CREATED_BY" CHARACTER VARYING(50) NOT NULL,
    "CREATED_DATE" TIMESTAMP,
    "RESET_DATE" TIMESTAMP,
    "LAST_MODIFIED_BY" CHARACTER VARYING(50),
    "LAST_MODIFIED_DATE" TIMESTAMP
);               
ALTER TABLE "PUBLIC"."JHI_USER" ADD CONSTRAINT "PUBLIC"."PK_JHI_USER" PRIMARY KEY("ID");       
-- 0 +/- SELECT COUNT(*) FROM PUBLIC.JHI_USER; 
CREATE MEMORY TABLE "PUBLIC"."JHI_AUTHORITY"(
    "NAME" CHARACTER VARYING(50) NOT NULL
);     
ALTER TABLE "PUBLIC"."JHI_AUTHORITY" ADD CONSTRAINT "PUBLIC"."PK_JHI_AUTHORITY" PRIMARY KEY("NAME");           
-- 0 +/- SELECT COUNT(*) FROM PUBLIC.JHI_AUTHORITY;            
CREATE MEMORY TABLE "PUBLIC"."JHI_USER_AUTHORITY"(
    "USER_ID" BIGINT NOT NULL,
    "AUTHORITY_NAME" CHARACTER VARYING(50) NOT NULL
);       
ALTER TABLE "PUBLIC"."JHI_USER_AUTHORITY" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_E" PRIMARY KEY("USER_ID", "AUTHORITY_NAME");     
-- 0 +/- SELECT COUNT(*) FROM PUBLIC.JHI_USER_AUTHORITY;       
CREATE MEMORY TABLE "PUBLIC"."CLOTHE"(
    "ID" BIGINT NOT NULL,
    "TYPE" CHARACTER VARYING(255),
    "THEME" CHARACTER VARYING(255),
    "GENDER" CHARACTER VARYING(255),
    "PRICE" REAL,
    "DESCRIPTION" CHARACTER VARYING(255),
    "IMAGEP" CHARACTER VARYING(255)
);
ALTER TABLE "PUBLIC"."CLOTHE" ADD CONSTRAINT "PUBLIC"."PK_CLOTHE" PRIMARY KEY("ID");           
-- 19 +/- SELECT COUNT(*) FROM PUBLIC.CLOTHE;  
INSERT INTO "PUBLIC"."CLOTHE" VALUES
(1, 'SHORT', 'Spiderman', 'MAN', 50.0, U&'Short de compression Anime Gym Short d''entra\00eenement respirant 2 couches', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/1/Blanc/Image_1.webp'),
(2, 'TEESHIRT', 'AnimeGirl', 'WOMAN', 32.15, U&'Chemise de gym Anime Girl surdimensionn\00e9e, t-shirt Muscle Mommy, chemise vintage Comfort Colors, chemise Kanji japonaise3', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/2/Noir/Image_1.webp'),
(3, 'TEESHIRT', 'Berserk', 'MAN', 51.55, U&'Haut serr\00e9 Berserk !', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/3/Blanc/Image_1.webp'),
(4, 'JOGGER', 'Haikyuu', 'MAN', 34.9, U&'Enfiles ce superbe surv\00eatement de Haikyuu et porte les couleurs de tes \00e9quipes pr\00e9f\00e9r\00e9es !', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/4/Blanc/Image_1.webp'),
(5, 'TEESHIRT', 'Haikyuu', 'MAN', 18.0, U&'Tee-Shirt en maille de sport con\00e7u sur les maillots de l''anim\00e9 Haikyuu !', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/5/Noir/Image_1.webp'),
(6, 'SHORT', 'Jujutsu Kaisen', 'MAN', 16.0, 'Short de sport Toji', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/6/Blanc/Image_1.webp'),
(7, 'TEESHIRT', 'Jujutsu Kaisen', 'MAN', 18.0, U&'Haut de corps moul\00e9 Toji, Jujutsu Kaisen', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/7/Blanc/Image_1.webp'),
(8, 'TEESHIRT', 'One Piece', 'MAN', 12.37, U&'Rash Guard-Chemises de Compression pour Hommes, Imprim\00e9 Anime Manga, Fitness, vaccage Rapide, dehors, Y-Tees, Ext\00e9rieur, \00c9t\00e9, \00e9ventuelles F 60', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/8/Blanc/Image_1.webp'),
(9, 'SHORT', 'One Piece', 'UNISEX', 36.99, 'Short de Fitness de Compression - One Piece Portgas D. Ace', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/9/Noir/Image_1.webp'),
(10, 'LEGGING', 'Dragon Ball Z', 'MAN', 39.9, U&'Ce Legging Dragon Ball Z Musculation est d\2019une excellente qualit\00e9 et souple. Il permet de s\2019entra\00eener avec intensit\00e9.', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/10/Noir/Image_1.webp'),
(11, 'BRA', 'Dragon Ball Z', 'WOMAN', 39.9, U&'Cette Brassi\00e8re Dragon Ball Z aux couleurs de Bulma a \00e9t\00e9 sp\00e9cialement con\00e7ue pour tes s\00e9ances de sport (musculation, yoga, running, \2026). Augmente tes performances et r\00e9veille le Guerrier qui sommeille en toi !', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/11/Blanc/Image_1.webp'),
(12, 'LEGGING', 'Venom', 'WOMAN', 28.0, 'Legging de sport pour Femmes Venum X Sophia Rose - Urban Red Camo', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/12/Vert/Image_1.webp'),
(13, 'BRA', 'Venom', 'WOMAN', 29.0, U&'Brassi\00e8re de sport pour Femmes Venum X Sophia Rose - Urban Red Camo', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/13/Rouge/Image_1.webp'),
(14, 'SWEAT', 'Undertale', 'CHILD', 14.05, U&'Undertale-Sweat \00e0 capuche Sportedly pour homme, sweat-shirt de jeu, costume cool, v\00eatements d''hiver avec poche combin\00e9e, streetwear pour adolescent', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/14/Noir/Image_1.webp'),
(15, 'SWEAT', 'Call of Duty', 'MAN', 41.99, U&'Call of Duty: Modern Warfare 2 Official Video Game Logo Sweat \00e0 Capuche', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/15/Noir/Image_1.webp'),
(16, 'SWEAT', 'Attaque des Titans', 'UNISEX', 34.9, 'Sweat avec capuche mixte de Livai', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/16/Noir/Image_1.webp'),
(17, 'TEESHIRT', 'Attaque des Titans', 'UNISEX', 24.9, 'T-shirt mixte de Livai', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/17/Bleu/Image_1.webp'),
(18, 'JOGGER', 'Minecraft', 'CHILD', 9.99, 'Minecraft Jogging enfant', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/18/Noir/Image_1.webp'),
(19, 'SWEAT', 'Minecraft', 'CHILD', 17.49, U&'Sweat \00e0 capuche avec motifs et inscription gar\00e7on - Minecraft noir', 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/19/Noir/Image_1.webp');        
CREATE MEMORY TABLE "PUBLIC"."CLOTHE_CATEGORIES"(
    "ID" BIGINT NOT NULL,
    "CATEGORY" CHARACTER VARYING(255),
    "CLOTHE_ID" BIGINT
);   
ALTER TABLE "PUBLIC"."CLOTHE_CATEGORIES" ADD CONSTRAINT "PUBLIC"."PK_CLOTHE_CATEGORIES" PRIMARY KEY("ID");     
-- 23 +/- SELECT COUNT(*) FROM PUBLIC.CLOTHE_CATEGORIES;       
INSERT INTO "PUBLIC"."CLOTHE_CATEGORIES" VALUES
(1, 'VIDEOGAME', 1),
(2, 'ANIME', 2),
(3, 'ANIME', 3),
(4, 'ANIME', 4),
(5, 'ANIME', 5),
(6, 'ANIME', 6),
(7, 'VIDEOGAME', 6),
(8, 'ANIME', 7),
(9, 'VIDEOGAME', 7),
(10, 'ANIME', 8),
(11, 'ANIME', 9),
(12, 'ANIME', 10),
(13, 'VIDEOGAME', 10),
(14, 'ANIME', 11),
(15, 'VIDEOGAME', 11),
(16, 'VIDEOGAME', 12),
(17, 'VIDEOGAME', 13),
(18, 'VIDEOGAME', 14),
(19, 'VIDEOGAME', 15),
(20, 'ANIME', 16),
(21, 'ANIME', 17),
(22, 'VIDEOGAME', 18),
(23, 'VIDEOGAME', 19);   
CREATE MEMORY TABLE "PUBLIC"."ARTICLE_IMAGES"(
    "ID" BIGINT NOT NULL,
    "ARTICLE_ID" BIGINT,
    "IMAGE_URL" CHARACTER VARYING(255)
);    
ALTER TABLE "PUBLIC"."ARTICLE_IMAGES" ADD CONSTRAINT "PUBLIC"."PK_ARTICLE_IMAGES" PRIMARY KEY("ID");           
-- 3 +/- SELECT COUNT(*) FROM PUBLIC.ARTICLE_IMAGES;           
INSERT INTO "PUBLIC"."ARTICLE_IMAGES" VALUES
(1, 10, 'balalal'),
(2, 10, 'balaaaaa'),
(3, 1, 'ppppp');         
CREATE MEMORY TABLE "PUBLIC"."STOCK"(
    "ID" BIGINT NOT NULL,
    "COLOR" CHARACTER VARYING(255),
    "SIZE" CHARACTER VARYING(255),
    "QUANTITY" INTEGER,
    "VERSION" INTEGER NOT NULL,
    "CLOTHE_ID" BIGINT
);       
ALTER TABLE "PUBLIC"."STOCK" ADD CONSTRAINT "PUBLIC"."PK_STOCK" PRIMARY KEY("ID");             
-- 135 +/- SELECT COUNT(*) FROM PUBLIC.STOCK;  
INSERT INTO "PUBLIC"."STOCK" VALUES
(1, 'WHITE', 'M', 5, 1, 1),
(2, 'WHITE', 'L', 15, 1, 1),
(3, 'WHITE', 'XL', 10, 1, 1),
(4, 'BLACK', 'M', 5, 1, 1),
(5, 'BLACK', 'L', 15, 1, 1),
(6, 'BLACK', 'S', 10, 1, 1),
(7, 'GRAY', 'XS', 20, 1, 2),
(8, 'GRAY', 'S', 22, 1, 2),
(9, 'GRAY', 'M', 28, 1, 2),
(10, 'GRAY', 'L', 8, 1, 2),
(11, 'GRAY', 'FOURTEEN', 18, 1, 2),
(12, 'YELLOW', 'XS', 20, 1, 2),
(13, 'YELLOW', 'S', 22, 1, 2),
(14, 'YELLOW', 'M', 28, 1, 2),
(15, 'YELLOW', 'L', 8, 1, 2),
(16, 'YELLOW', 'FOURTEEN', 18, 1, 2),
(17, 'BLACK', 'S', 22, 1, 2),
(18, 'BLACK', 'M', 28, 1, 2),
(19, 'BLACK', 'L', 8, 1, 2),
(20, 'WHITE', 'XL', 48, 1, 3),
(21, 'GRAY', 'S', 28, 1, 3),
(22, 'GRAY', 'XL', 17, 1, 3),
(23, 'BLACK', 'XL', 25, 1, 3),
(24, 'BLACK', 'XXS', 2, 1, 3),
(25, 'BLACK', 'L', 10, 1, 3),
(26, 'WHITE', 'S', 13, 1, 4),
(27, 'WHITE', 'XL', 13, 1, 4),
(28, 'WHITE', 'L', 19, 1, 4),
(29, 'BLACK', 'XL', 7, 1, 4),
(30, 'ORANGE', 'XXL', 30, 1, 4),
(31, 'ORANGE', 'L', 30, 1, 4),
(32, 'ORANGE', 'XS', 0, 1, 4),
(33, 'RED', 'M', 4, 1, 4),
(34, 'RED', 'XXL', 30, 1, 4),
(35, 'RED', 'XS', 17, 1, 4),
(36, 'GREEN', 'XS', 3, 1, 4),
(37, 'BLACK', 'XXL', 27, 1, 5),
(38, 'BLACK', 'M', 35, 1, 5),
(39, 'BLACK', 'XXS', 44, 1, 5),
(40, 'ORANGE', 'XL', 37, 1, 5),
(41, 'RED', 'S', 26, 1, 5),
(42, 'RED', 'XXS', 48, 1, 5),
(43, 'RED', 'M', 31, 1, 5),
(44, 'WHITE', 'XS', 40, 1, 6),
(45, 'BLUE', 'L', 5, 1, 6),
(46, 'BLUE', 'XS', 13, 1, 6),
(47, 'BLUE', 'M', 8, 1, 6),
(48, 'GRAY', 'L', 23, 1, 6),
(49, 'GRAY', 'XL', 24, 1, 6),
(50, 'GRAY', 'M', 47, 1, 6),
(51, 'YELLOW', 'M', 37, 1, 6),
(52, 'YELLOW', 'L', 4, 1, 6),
(53, 'YELLOW', 'XL', 48, 1, 6),
(54, 'BLACK', 'L', 28, 1, 6),
(55, 'BLACK', 'XXS', 33, 1, 6),
(56, 'BLACK', 'XXL', 17, 1, 6),
(57, 'RED', 'XXL', 42, 1, 6),
(58, 'RED', 'M', 16, 1, 6),
(59, 'RED', 'XL', 34, 1, 6),
(60, 'GREEN', 'XXS', 33, 1, 6),
(61, 'GREEN', 'XS', 18, 1, 6),
(62, 'GREEN', 'L', 10, 1, 6),
(63, 'WHITE', 'L', 14, 1, 7),
(64, 'WHITE', 'XXS', 42, 1, 7),
(65, 'BLUE', 'XS', 18, 1, 7),
(66, 'GRAY', 'XL', 24, 1, 7),
(67, 'BLACK', 'XL', 18, 1, 7),
(68, 'BLACK', 'XXL', 25, 1, 7),
(69, 'BLACK', 'XXS', 0, 1, 7),
(70, 'WHITE', 'XXS', 17, 1, 8),
(71, 'WHITE', 'XXL', 34, 1, 8),
(72, 'WHITE', 'XS', 8, 1, 8),
(73, 'BLUE', 'M', 43, 1, 8),
(74, 'BLUE', 'XXL', 26, 1, 8),
(75, 'BLUE', 'XL', 43, 1, 8),
(76, 'GRAY', 'XL', 0, 1, 8),
(77, 'GRAY', 'XXS', 16, 1, 8),
(78, 'GRAY', 'L', 5, 1, 8),
(79, 'BLACK', 'XXS', 7, 1, 8),
(80, 'RED', 'XXL', 25, 1, 8),
(81, 'GREEN', 'M', 48, 1, 8),
(82, 'GREEN', 'XXL', 23, 1, 8),
(83, 'BLUE', 'XL', 46, 1, 9),
(84, 'BLACK', 'XXS', 43, 1, 9),
(85, 'ORANGE', 'XS', 42, 1, 9),
(86, 'ORANGE', 'XXL', 20, 1, 9),
(87, 'PINK', 'XXS', 40, 1, 9),
(88, 'PINK', 'XXL', 24, 1, 9),
(89, 'RED', 'XL', 15, 1, 9),
(90, 'RED', 'XXS', 24, 1, 9),
(91, 'BLACK', 'M', 22, 1, 10),
(92, 'BLACK', 'L', 9, 1, 10),
(93, 'BLACK', 'XXL', 43, 1, 10),
(94, 'WHITE', 'M', 23, 1, 11),
(95, 'WHITE', 'XXL', 11, 1, 11),
(96, 'WHITE', 'S', 14, 1, 11),
(97, 'PINK', 'XXS', 13, 1, 11),
(98, 'PINK', 'XL', 1, 1, 11),
(99, 'RED', 'S', 24, 1, 12),
(100, 'GREEN', 'XXL', 30, 1, 12),
(101, 'GREEN', 'XS', 27, 1, 12),
(102, 'RED', 'XL', 26, 1, 13),
(103, 'RED', 'S', 26, 1, 13),
(104, 'GREEN', 'XXL', 48, 1, 13),
(105, 'GRAY', 'XXS', 0, 1, 14),
(106, 'GRAY', 'L', 41, 1, 14),
(107, 'GRAY', 'M', 45, 1, 14),
(108, 'BLACK', 'S', 16, 1, 14),
(109, 'PURPLE', 'XL', 49, 1, 14),
(110, 'PURPLE', 'XXS', 25, 1, 14),
(111, 'PURPLE', 'L', 35, 1, 14),
(112, 'BLUE', 'L', 37, 1, 15),
(113, 'GRAY', 'S', 20, 1, 15),
(114, 'BLACK', 'XXS', 6, 1, 15),
(115, 'BLACK', 'XS', 19, 1, 15),
(116, 'WHITE', 'L', 20, 1, 16),
(117, 'WHITE', 'XXS', 39, 1, 16),
(118, 'BLACK', 'XL', 14, 1, 16),
(119, 'PINK', 'XL', 14, 1, 16),
(120, 'PINK', 'XXS', 3, 1, 16),
(121, 'PINK', 'XS', 7, 1, 16),
(122, 'WHITE', 'S', 13, 1, 17),
(123, 'WHITE', 'M', 30, 1, 17),
(124, 'WHITE', 'XS', 0, 1, 17),
(125, 'BLUE', 'XL', 38, 1, 17),
(126, 'PINK', 'XL', 38, 1, 17),
(127, 'PINK', 'L', 46, 1, 17),
(128, 'BLACK', 'L', 5, 1, 18),
(129, 'BLACK', 'M', 15, 1, 18),
(130, 'GREEN', 'XS', 2, 1, 18),
(131, 'GREEN', 'M', 2, 1, 18),
(132, 'GREEN', 'S', 45, 1, 18);     
INSERT INTO "PUBLIC"."STOCK" VALUES
(133, 'BLACK', 'XS', 2, 1, 19),
(134, 'BLACK', 'S', 22, 1, 19),
(135, 'BLACK', 'XXS', 45, 1, 19);          
CREATE MEMORY TABLE "PUBLIC"."ORDER_LINE"(
    "ID" BIGINT NOT NULL,
    "QUANTITY" INTEGER,
    "AMOUNTLINE" REAL,
    "ORDER_ID" BIGINT,
    "STOCK_ID" BIGINT
);            
ALTER TABLE "PUBLIC"."ORDER_LINE" ADD CONSTRAINT "PUBLIC"."PK_ORDER_LINE" PRIMARY KEY("ID");   
-- 0 +/- SELECT COUNT(*) FROM PUBLIC.ORDER_LINE;               
CREATE MEMORY TABLE "PUBLIC"."JHI_ORDER"(
    "ID" BIGINT NOT NULL,
    "STATUS" CHARACTER VARYING(255),
    "DATE" DATE,
    "AMOUNT" REAL,
    "MEAN_OF_PAYMENT" CHARACTER VARYING(255),
    U&"CLIENT_ABONN\00c9_ID" BIGINT,
    "DELIVERYADRESS" CHARACTER VARYING(255)
); 
ALTER TABLE "PUBLIC"."JHI_ORDER" ADD CONSTRAINT "PUBLIC"."PK_JHI_ORDER" PRIMARY KEY("ID");     
-- 0 +/- SELECT COUNT(*) FROM PUBLIC.JHI_ORDER;
CREATE MEMORY TABLE "PUBLIC"."SUBSCRIBED_CLIENTS"(
    "ID" BIGINT NOT NULL,
    "BIRTHDAY" DATE,
    "EMAIL" CHARACTER VARYING(255),
    "ADDRESS" CHARACTER VARYING(255),
    "BANK_CARD" CHARACTER VARYING(255),
    "PHONE" CHARACTER VARYING(255),
    "POINTS" INTEGER,
    "BASKET_ID" BIGINT,
    "USER_ID" BIGINT
);  
ALTER TABLE "PUBLIC"."SUBSCRIBED_CLIENTS" ADD CONSTRAINT "PUBLIC"."PK_SUBSCRIBED_CLIENTS" PRIMARY KEY("ID");   
-- 0 +/- SELECT COUNT(*) FROM PUBLIC.SUBSCRIBED_CLIENTS;       
CREATE MEMORY TABLE "PUBLIC"."REL_SUBSCRIBED_CLIENTS__FAVORIS"(
    "FAVORIS_ID" BIGINT NOT NULL,
    "SUBSCRIBED_CLIENTS_ID" BIGINT NOT NULL
);               
ALTER TABLE "PUBLIC"."REL_SUBSCRIBED_CLIENTS__FAVORIS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_2" PRIMARY KEY("SUBSCRIBED_CLIENTS_ID", "FAVORIS_ID");              
-- 0 +/- SELECT COUNT(*) FROM PUBLIC.REL_SUBSCRIBED_CLIENTS__FAVORIS;          
CREATE MEMORY TABLE "PUBLIC"."FAVORIS"(
    "SUBSCRIBED_CLIENTS_ID" BIGINT NOT NULL,
    "CLOTHE_ID" BIGINT NOT NULL
);        
ALTER TABLE "PUBLIC"."FAVORIS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_EA" PRIMARY KEY("SUBSCRIBED_CLIENTS_ID", "CLOTHE_ID");      
-- 0 +/- SELECT COUNT(*) FROM PUBLIC.FAVORIS;  
ALTER TABLE "PUBLIC"."JHI_USER" ADD CONSTRAINT "PUBLIC"."UX_USER_LOGIN" UNIQUE("LOGIN");       
ALTER TABLE "PUBLIC"."SUBSCRIBED_CLIENTS" ADD CONSTRAINT "PUBLIC"."UX_SUBSCRIBED_CLIENTS__BASKET_ID" UNIQUE("BASKET_ID");      
ALTER TABLE "PUBLIC"."JHI_USER" ADD CONSTRAINT "PUBLIC"."UX_USER_EMAIL" UNIQUE("EMAIL");       
ALTER TABLE "PUBLIC"."ORDER_LINE" ADD CONSTRAINT "PUBLIC"."FK_ORDER_LINE__ORDER_ID" FOREIGN KEY("ORDER_ID") REFERENCES "PUBLIC"."JHI_ORDER"("ID") NOCHECK;     
ALTER TABLE "PUBLIC"."ORDER_LINE" ADD CONSTRAINT "PUBLIC"."FK_ORDER_LINE__STOCK_ID" FOREIGN KEY("STOCK_ID") REFERENCES "PUBLIC"."STOCK"("ID") NOCHECK;         
ALTER TABLE "PUBLIC"."CLOTHE_CATEGORIES" ADD CONSTRAINT "PUBLIC"."FK_CATEGORIES__CLOTHE_ID" FOREIGN KEY("CLOTHE_ID") REFERENCES "PUBLIC"."CLOTHE"("ID") NOCHECK;               
ALTER TABLE "PUBLIC"."REL_SUBSCRIBED_CLIENTS__FAVORIS" ADD CONSTRAINT "PUBLIC"."FK_REL_SUBSCRIBED_CLIENTS__FAVORIS__SUBSCRIBED_CLIENTS_ID" FOREIGN KEY("SUBSCRIBED_CLIENTS_ID") REFERENCES "PUBLIC"."SUBSCRIBED_CLIENTS"("ID") NOCHECK;        
ALTER TABLE "PUBLIC"."JHI_ORDER" ADD CONSTRAINT "PUBLIC"."FK_JHI_ORDER__CLIENT_ID" FOREIGN KEY(U&"CLIENT_ABONN\00c9_ID") REFERENCES "PUBLIC"."SUBSCRIBED_CLIENTS"("ID") NOCHECK;               
ALTER TABLE "PUBLIC"."FAVORIS" ADD CONSTRAINT "PUBLIC"."FKPFNYL4OCPGHR4BRFEPQ7H8SWT" FOREIGN KEY("SUBSCRIBED_CLIENTS_ID") REFERENCES "PUBLIC"."SUBSCRIBED_CLIENTS"("ID") NOCHECK;              
ALTER TABLE "PUBLIC"."FAVORIS" ADD CONSTRAINT "PUBLIC"."FK4I1Q28FU5Q0HLE0N4OTCBT769" FOREIGN KEY("CLOTHE_ID") REFERENCES "PUBLIC"."CLOTHE"("ID") NOCHECK;      
ALTER TABLE "PUBLIC"."SUBSCRIBED_CLIENTS" ADD CONSTRAINT "PUBLIC"."FK_SUBSCRIBED_CLIENTS__BASKET_ID" FOREIGN KEY("BASKET_ID") REFERENCES "PUBLIC"."JHI_ORDER"("ID") NOCHECK;   
ALTER TABLE "PUBLIC"."REL_SUBSCRIBED_CLIENTS__FAVORIS" ADD CONSTRAINT "PUBLIC"."FK_REL_SUBSCRIBED_CLIENTS__FAVORIS__FAVORIS_ID" FOREIGN KEY("FAVORIS_ID") REFERENCES "PUBLIC"."CLOTHE"("ID") NOCHECK;          
ALTER TABLE "PUBLIC"."JHI_USER_AUTHORITY" ADD CONSTRAINT "PUBLIC"."FK_USER_ID" FOREIGN KEY("USER_ID") REFERENCES "PUBLIC"."JHI_USER"("ID") NOCHECK;            
ALTER TABLE "PUBLIC"."SUBSCRIBED_CLIENTS" ADD CONSTRAINT "PUBLIC"."FK_SUBSCRIBED_CLIENTS__ID" FOREIGN KEY("USER_ID") REFERENCES "PUBLIC"."JHI_USER"("ID") NOCHECK;             
ALTER TABLE "PUBLIC"."ARTICLE_IMAGES" ADD CONSTRAINT "PUBLIC"."FK_IMAGE__CLIENT_ID" FOREIGN KEY("ARTICLE_ID") REFERENCES "PUBLIC"."STOCK"("ID") NOCHECK;       
ALTER TABLE "PUBLIC"."STOCK" ADD CONSTRAINT "PUBLIC"."FK_STOCK__CLOTHE_ID" FOREIGN KEY("CLOTHE_ID") REFERENCES "PUBLIC"."CLOTHE"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."JHI_USER_AUTHORITY" ADD CONSTRAINT "PUBLIC"."FK_AUTHORITY_NAME" FOREIGN KEY("AUTHORITY_NAME") REFERENCES "PUBLIC"."JHI_AUTHORITY"("NAME") NOCHECK;       
