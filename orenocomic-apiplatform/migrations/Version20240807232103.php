<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240807232103 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
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
        $this->addSql('ALTER TABLE
          comic_synopsis
        ADD
          CONSTRAINT FK_30D32311D663094A FOREIGN KEY (comic_id) REFERENCES comic (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE
          comic_synopsis
        ADD
          CONSTRAINT FK_30D3231182F1BAF4 FOREIGN KEY (language_id) REFERENCES language (id)');
        $this->addSql('DROP INDEX UNIQ_EC795EC9C288C859 ON comic_cover');
        $this->addSql('DROP INDEX UNIQ_4A47A067C288C859 ON comic_title');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE comic_synopsis DROP FOREIGN KEY FK_30D32311D663094A');
        $this->addSql('ALTER TABLE comic_synopsis DROP FOREIGN KEY FK_30D3231182F1BAF4');
        $this->addSql('DROP TABLE comic_synopsis');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4A47A067C288C859 ON comic_title (ulid)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_EC795EC9C288C859 ON comic_cover (ulid)');
    }
}
