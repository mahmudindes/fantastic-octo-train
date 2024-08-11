<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240731020148 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE link (
          id BIGINT AUTO_INCREMENT NOT NULL,
          website_id BIGINT NOT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          ulid BINARY(16) NOT NULL COMMENT \'(DC2Type:ulid)\',
          relative_url VARCHAR(128) DEFAULT NULL,
          UNIQUE INDEX UNIQ_36AC99F1C288C859 (ulid),
          INDEX IDX_36AC99F118F45C82 (website_id),
          UNIQUE INDEX UNIQ_36AC99F118F45C8230209192 (website_id, relative_url),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE
          link
        ADD
          CONSTRAINT FK_36AC99F118F45C82 FOREIGN KEY (website_id) REFERENCES website (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE category DROP FOREIGN KEY FK_64C19C1727ACA70');
        $this->addSql('ALTER TABLE
          category
        ADD
          CONSTRAINT FK_64C19C1727ACA70 FOREIGN KEY (parent_id) REFERENCES category (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE link DROP FOREIGN KEY FK_36AC99F118F45C82');
        $this->addSql('DROP TABLE link');
        $this->addSql('ALTER TABLE category DROP FOREIGN KEY FK_64C19C1727ACA70');
        $this->addSql('ALTER TABLE
          category
        ADD
          CONSTRAINT FK_64C19C1727ACA70 FOREIGN KEY (parent_id) REFERENCES category (id)');
    }
}
