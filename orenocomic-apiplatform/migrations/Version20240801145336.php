<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240801145336 extends AbstractMigration
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
        $this->addSql('ALTER TABLE
          category
        ADD
          CONSTRAINT FK_64C19C1C54C8C93 FOREIGN KEY (type_id) REFERENCES category_type (id)');
        $this->addSql('ALTER TABLE
          category
        ADD
          CONSTRAINT FK_64C19C1727ACA70 FOREIGN KEY (parent_id) REFERENCES category (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE category DROP FOREIGN KEY FK_64C19C1C54C8C93');
        $this->addSql('ALTER TABLE category DROP FOREIGN KEY FK_64C19C1727ACA70');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE category_type');
    }
}
