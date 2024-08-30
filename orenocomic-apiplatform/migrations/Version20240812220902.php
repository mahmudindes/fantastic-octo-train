<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240812220902 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE comic_external (
          id BIGINT AUTO_INCREMENT NOT NULL,
          comic_id BIGINT NOT NULL,
          link_id BIGINT NOT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          ulid BINARY(16) NOT NULL COMMENT \'(DC2Type:ulid)\',
          official TINYINT(1) DEFAULT NULL,
          community TINYINT(1) DEFAULT NULL,
          INDEX IDX_3FAB5600D663094A (comic_id),
          INDEX IDX_3FAB5600ADA40271 (link_id),
          UNIQUE INDEX UNIQ_3FAB5600D663094AC288C859 (comic_id, ulid),
          UNIQUE INDEX UNIQ_3FAB5600D663094AADA40271 (comic_id, link_id),
          PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE
          comic_external
        ADD
          CONSTRAINT FK_3FAB5600D663094A FOREIGN KEY (comic_id) REFERENCES comic (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE
          comic_external
        ADD
          CONSTRAINT FK_3FAB5600ADA40271 FOREIGN KEY (link_id) REFERENCES link (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE comic_external DROP FOREIGN KEY FK_3FAB5600D663094A');
        $this->addSql('ALTER TABLE comic_external DROP FOREIGN KEY FK_3FAB5600ADA40271');
        $this->addSql('DROP TABLE comic_external');
    }
}
