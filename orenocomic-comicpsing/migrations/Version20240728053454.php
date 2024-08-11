<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240728053454 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE category (
          id BIGINT AUTO_INCREMENT NOT NULL,
          type_id BIGINT NOT NULL,
          parent_id BIGINT DEFAULT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          code VARCHAR(32) NOT NULL,
          name VARCHAR(32) NOT NULL,
          INDEX IDX_64C19C1C54C8C93 (type_id),
          INDEX IDX_64C19C1727ACA70 (parent_id),
          UNIQUE INDEX UNIQ_64C19C1C54C8C9377153098 (type_id, code),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE category_type (
          id BIGINT AUTO_INCREMENT NOT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          code VARCHAR(32) NOT NULL,
          name VARCHAR(32) NOT NULL,
          UNIQUE INDEX UNIQ_7452D6E77153098 (code),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE comic (
          id BIGINT AUTO_INCREMENT NOT NULL,
          language_id BIGINT DEFAULT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          code VARCHAR(8) NOT NULL,
          published_from DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          published_to DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          total_chapter INT DEFAULT NULL,
          total_volume INT DEFAULT NULL,
          nsfw SMALLINT DEFAULT NULL,
          nsfl SMALLINT DEFAULT NULL,
          additional JSON DEFAULT NULL COMMENT \'(DC2Type:json)\',
          UNIQUE INDEX UNIQ_5B7EA5AA77153098 (code),
          INDEX IDX_5B7EA5AA82F1BAF4 (language_id),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE comic_category (
          comic_id BIGINT NOT NULL,
          category_id BIGINT NOT NULL,
          INDEX IDX_61B5EE79D663094A (comic_id),
          INDEX IDX_61B5EE7912469DE2 (category_id),
          PRIMARY KEY(comic_id, category_id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE comic_tag (
          comic_id BIGINT NOT NULL,
          tag_id BIGINT NOT NULL,
          INDEX IDX_FE821497D663094A (comic_id),
          INDEX IDX_FE821497BAD26311 (tag_id),
          PRIMARY KEY(comic_id, tag_id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE comic_chapter (
          id BIGINT AUTO_INCREMENT NOT NULL,
          comic_id BIGINT NOT NULL,
          volume_id BIGINT DEFAULT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          chapter VARCHAR(64) NOT NULL,
          version VARCHAR(32) DEFAULT NULL,
          released_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          INDEX IDX_DD3CC1B5D663094A (comic_id),
          INDEX IDX_DD3CC1B58FD80EEA (volume_id),
          UNIQUE INDEX UNIQ_DD3CC1B5D663094AF981B52EBF1CD3C3 (comic_id, chapter, version),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE comic_cover (
          id BIGINT AUTO_INCREMENT NOT NULL,
          comic_id BIGINT NOT NULL,
          website_id BIGINT NOT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          ulid BINARY(16) NOT NULL COMMENT \'(DC2Type:ulid)\',
          relative_url VARCHAR(128) NOT NULL,
          hint VARCHAR(64) DEFAULT NULL,
          INDEX IDX_EC795EC9D663094A (comic_id),
          INDEX IDX_EC795EC918F45C82 (website_id),
          UNIQUE INDEX UNIQ_EC795EC9D663094AC288C859 (comic_id, ulid),
          UNIQUE INDEX UNIQ_EC795EC9D663094A18F45C8230209192 (
            comic_id, website_id, relative_url
          ),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE comic_external (
          id BIGINT AUTO_INCREMENT NOT NULL,
          comic_id BIGINT NOT NULL,
          website_id BIGINT NOT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          ulid BINARY(16) NOT NULL COMMENT \'(DC2Type:ulid)\',
          relative_url VARCHAR(128) DEFAULT NULL,
          official TINYINT(1) DEFAULT NULL,
          INDEX IDX_3FAB5600D663094A (comic_id),
          INDEX IDX_3FAB560018F45C82 (website_id),
          UNIQUE INDEX UNIQ_3FAB5600D663094AC288C859 (comic_id, ulid),
          UNIQUE INDEX UNIQ_3FAB5600D663094A18F45C8230209192 (
            comic_id, website_id, relative_url
          ),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE comic_relation (
          type_id BIGINT NOT NULL,
          parent_id BIGINT NOT NULL,
          child_id BIGINT NOT NULL,
          INDEX IDX_570B0F1C54C8C93 (type_id),
          INDEX IDX_570B0F1727ACA70 (parent_id),
          INDEX IDX_570B0F1DD62C21B (child_id),
          PRIMARY KEY(type_id, parent_id, child_id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE comic_relation_type (
          id BIGINT AUTO_INCREMENT NOT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          code VARCHAR(32) NOT NULL,
          name VARCHAR(32) NOT NULL,
          UNIQUE INDEX UNIQ_905B8C5077153098 (code),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE comic_synopsis (
          id BIGINT AUTO_INCREMENT NOT NULL,
          comic_id BIGINT NOT NULL,
          language_id BIGINT NOT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          ulid BINARY(16) NOT NULL COMMENT \'(DC2Type:ulid)\',
          synopsis VARCHAR(2048) NOT NULL,
          version VARCHAR(16) DEFAULT NULL,
          romanized TINYINT(1) DEFAULT NULL,
          INDEX IDX_30D32311D663094A (comic_id),
          INDEX IDX_30D3231182F1BAF4 (language_id),
          UNIQUE INDEX UNIQ_30D32311D663094AC288C859 (comic_id, ulid),
          UNIQUE INDEX UNIQ_30D32311D663094A572AD4A9 (comic_id, synopsis),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE comic_title (
          id BIGINT AUTO_INCREMENT NOT NULL,
          comic_id BIGINT NOT NULL,
          language_id BIGINT NOT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          ulid BINARY(16) NOT NULL COMMENT \'(DC2Type:ulid)\',
          title VARCHAR(255) NOT NULL,
          synonym TINYINT(1) NOT NULL,
          romanized TINYINT(1) DEFAULT NULL,
          INDEX IDX_4A47A067D663094A (comic_id),
          INDEX IDX_4A47A06782F1BAF4 (language_id),
          UNIQUE INDEX UNIQ_4A47A067D663094AC288C859 (comic_id, ulid),
          UNIQUE INDEX UNIQ_4A47A067D663094A2B36786B (comic_id, title),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE comic_volume (
          id BIGINT AUTO_INCREMENT NOT NULL,
          comic_id BIGINT NOT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          volume VARCHAR(64) NOT NULL,
          released_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          INDEX IDX_B04DF02DD663094A (comic_id),
          UNIQUE INDEX UNIQ_B04DF02DD663094AB99ACDDE (comic_id, volume),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE language (
          id BIGINT AUTO_INCREMENT NOT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          ietf VARCHAR(16) NOT NULL,
          name VARCHAR(32) NOT NULL,
          UNIQUE INDEX UNIQ_D4DB71B5C6F416C1 (ietf),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE tag (
          id BIGINT AUTO_INCREMENT NOT NULL,
          type_id BIGINT NOT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          code VARCHAR(32) NOT NULL,
          name VARCHAR(32) NOT NULL,
          INDEX IDX_389B783C54C8C93 (type_id),
          UNIQUE INDEX UNIQ_389B783C54C8C9377153098 (type_id, code),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE tag_type (
          id BIGINT AUTO_INCREMENT NOT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          code VARCHAR(32) NOT NULL,
          name VARCHAR(32) NOT NULL,
          UNIQUE INDEX UNIQ_62D1E89F77153098 (code),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE website (
          id BIGINT AUTO_INCREMENT NOT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          domain VARCHAR(32) NOT NULL,
          name VARCHAR(32) NOT NULL,
          UNIQUE INDEX UNIQ_476F5DE7A7A91E0B (domain),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (
          id BIGINT AUTO_INCREMENT NOT NULL,
          body LONGTEXT NOT NULL,
          headers LONGTEXT NOT NULL,
          queue_name VARCHAR(190) NOT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\',
          available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\',
          delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\',
          INDEX IDX_75EA56E0FB7336F0 (queue_name),
          INDEX IDX_75EA56E0E3BD61CE (available_at),
          INDEX IDX_75EA56E016BA31DB (delivered_at),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE
          category
        ADD
          CONSTRAINT FK_64C19C1C54C8C93 FOREIGN KEY (type_id) REFERENCES category_type (id)');
        $this->addSql('ALTER TABLE
          category
        ADD
          CONSTRAINT FK_64C19C1727ACA70 FOREIGN KEY (parent_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE
          comic
        ADD
          CONSTRAINT FK_5B7EA5AA82F1BAF4 FOREIGN KEY (language_id) REFERENCES language (id)');
        $this->addSql('ALTER TABLE
          comic_category
        ADD
          CONSTRAINT FK_61B5EE79D663094A FOREIGN KEY (comic_id) REFERENCES comic (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE
          comic_category
        ADD
          CONSTRAINT FK_61B5EE7912469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE
          comic_tag
        ADD
          CONSTRAINT FK_FE821497D663094A FOREIGN KEY (comic_id) REFERENCES comic (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE
          comic_tag
        ADD
          CONSTRAINT FK_FE821497BAD26311 FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE
          comic_chapter
        ADD
          CONSTRAINT FK_DD3CC1B5D663094A FOREIGN KEY (comic_id) REFERENCES comic (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE
          comic_chapter
        ADD
          CONSTRAINT FK_DD3CC1B58FD80EEA FOREIGN KEY (volume_id) REFERENCES comic_volume (id)');
        $this->addSql('ALTER TABLE
          comic_cover
        ADD
          CONSTRAINT FK_EC795EC9D663094A FOREIGN KEY (comic_id) REFERENCES comic (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE
          comic_cover
        ADD
          CONSTRAINT FK_EC795EC918F45C82 FOREIGN KEY (website_id) REFERENCES website (id)');
        $this->addSql('ALTER TABLE
          comic_external
        ADD
          CONSTRAINT FK_3FAB5600D663094A FOREIGN KEY (comic_id) REFERENCES comic (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE
          comic_external
        ADD
          CONSTRAINT FK_3FAB560018F45C82 FOREIGN KEY (website_id) REFERENCES website (id)');
        $this->addSql('ALTER TABLE
          comic_relation
        ADD
          CONSTRAINT FK_570B0F1C54C8C93 FOREIGN KEY (type_id) REFERENCES comic_relation_type (id)');
        $this->addSql('ALTER TABLE
          comic_relation
        ADD
          CONSTRAINT FK_570B0F1727ACA70 FOREIGN KEY (parent_id) REFERENCES comic (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE
          comic_relation
        ADD
          CONSTRAINT FK_570B0F1DD62C21B FOREIGN KEY (child_id) REFERENCES comic (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE
          comic_synopsis
        ADD
          CONSTRAINT FK_30D32311D663094A FOREIGN KEY (comic_id) REFERENCES comic (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE
          comic_synopsis
        ADD
          CONSTRAINT FK_30D3231182F1BAF4 FOREIGN KEY (language_id) REFERENCES language (id)');
        $this->addSql('ALTER TABLE
          comic_title
        ADD
          CONSTRAINT FK_4A47A067D663094A FOREIGN KEY (comic_id) REFERENCES comic (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE
          comic_title
        ADD
          CONSTRAINT FK_4A47A06782F1BAF4 FOREIGN KEY (language_id) REFERENCES language (id)');
        $this->addSql('ALTER TABLE
          comic_volume
        ADD
          CONSTRAINT FK_B04DF02DD663094A FOREIGN KEY (comic_id) REFERENCES comic (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE
          tag
        ADD
          CONSTRAINT FK_389B783C54C8C93 FOREIGN KEY (type_id) REFERENCES tag_type (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE category DROP FOREIGN KEY FK_64C19C1C54C8C93');
        $this->addSql('ALTER TABLE category DROP FOREIGN KEY FK_64C19C1727ACA70');
        $this->addSql('ALTER TABLE comic DROP FOREIGN KEY FK_5B7EA5AA82F1BAF4');
        $this->addSql('ALTER TABLE comic_category DROP FOREIGN KEY FK_61B5EE79D663094A');
        $this->addSql('ALTER TABLE comic_category DROP FOREIGN KEY FK_61B5EE7912469DE2');
        $this->addSql('ALTER TABLE comic_tag DROP FOREIGN KEY FK_FE821497D663094A');
        $this->addSql('ALTER TABLE comic_tag DROP FOREIGN KEY FK_FE821497BAD26311');
        $this->addSql('ALTER TABLE comic_chapter DROP FOREIGN KEY FK_DD3CC1B5D663094A');
        $this->addSql('ALTER TABLE comic_chapter DROP FOREIGN KEY FK_DD3CC1B58FD80EEA');
        $this->addSql('ALTER TABLE comic_cover DROP FOREIGN KEY FK_EC795EC9D663094A');
        $this->addSql('ALTER TABLE comic_cover DROP FOREIGN KEY FK_EC795EC918F45C82');
        $this->addSql('ALTER TABLE comic_external DROP FOREIGN KEY FK_3FAB5600D663094A');
        $this->addSql('ALTER TABLE comic_external DROP FOREIGN KEY FK_3FAB560018F45C82');
        $this->addSql('ALTER TABLE comic_relation DROP FOREIGN KEY FK_570B0F1C54C8C93');
        $this->addSql('ALTER TABLE comic_relation DROP FOREIGN KEY FK_570B0F1727ACA70');
        $this->addSql('ALTER TABLE comic_relation DROP FOREIGN KEY FK_570B0F1DD62C21B');
        $this->addSql('ALTER TABLE comic_synopsis DROP FOREIGN KEY FK_30D32311D663094A');
        $this->addSql('ALTER TABLE comic_synopsis DROP FOREIGN KEY FK_30D3231182F1BAF4');
        $this->addSql('ALTER TABLE comic_title DROP FOREIGN KEY FK_4A47A067D663094A');
        $this->addSql('ALTER TABLE comic_title DROP FOREIGN KEY FK_4A47A06782F1BAF4');
        $this->addSql('ALTER TABLE comic_volume DROP FOREIGN KEY FK_B04DF02DD663094A');
        $this->addSql('ALTER TABLE tag DROP FOREIGN KEY FK_389B783C54C8C93');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE category_type');
        $this->addSql('DROP TABLE comic');
        $this->addSql('DROP TABLE comic_category');
        $this->addSql('DROP TABLE comic_tag');
        $this->addSql('DROP TABLE comic_chapter');
        $this->addSql('DROP TABLE comic_cover');
        $this->addSql('DROP TABLE comic_external');
        $this->addSql('DROP TABLE comic_relation');
        $this->addSql('DROP TABLE comic_relation_type');
        $this->addSql('DROP TABLE comic_synopsis');
        $this->addSql('DROP TABLE comic_title');
        $this->addSql('DROP TABLE comic_volume');
        $this->addSql('DROP TABLE language');
        $this->addSql('DROP TABLE tag');
        $this->addSql('DROP TABLE tag_type');
        $this->addSql('DROP TABLE website');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
