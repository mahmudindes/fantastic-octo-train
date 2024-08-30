<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240802180059 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
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
        $this->addSql('CREATE TABLE comic_title (
          id BIGINT AUTO_INCREMENT NOT NULL,
          comic_id BIGINT NOT NULL,
          language_id BIGINT NOT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          ulid BINARY(16) NOT NULL COMMENT \'(DC2Type:ulid)\',
          title VARCHAR(255) NOT NULL,
          synonym TINYINT(1) DEFAULT NULL,
          romanized TINYINT(1) DEFAULT NULL,
          UNIQUE INDEX UNIQ_4A47A067C288C859 (ulid),
          INDEX IDX_4A47A067D663094A (comic_id),
          INDEX IDX_4A47A06782F1BAF4 (language_id),
          UNIQUE INDEX UNIQ_4A47A067D663094AC288C859 (comic_id, ulid),
          UNIQUE INDEX UNIQ_4A47A067D663094A2B36786B (comic_id, title),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE
          comic
        ADD
          CONSTRAINT FK_5B7EA5AA82F1BAF4 FOREIGN KEY (language_id) REFERENCES language (id)');
        $this->addSql('ALTER TABLE
          comic_title
        ADD
          CONSTRAINT FK_4A47A067D663094A FOREIGN KEY (comic_id) REFERENCES comic (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE
          comic_title
        ADD
          CONSTRAINT FK_4A47A06782F1BAF4 FOREIGN KEY (language_id) REFERENCES language (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE comic DROP FOREIGN KEY FK_5B7EA5AA82F1BAF4');
        $this->addSql('ALTER TABLE comic_title DROP FOREIGN KEY FK_4A47A067D663094A');
        $this->addSql('ALTER TABLE comic_title DROP FOREIGN KEY FK_4A47A06782F1BAF4');
        $this->addSql('DROP TABLE comic');
        $this->addSql('DROP TABLE comic_title');
    }
}
