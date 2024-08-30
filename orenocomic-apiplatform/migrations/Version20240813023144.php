<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240813023144 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE comic_category (
          comic_id BIGINT NOT NULL,
          category_id BIGINT NOT NULL,
          created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetimetz_immutable)\',
          INDEX IDX_61B5EE79D663094A (comic_id),
          INDEX IDX_61B5EE7912469DE2 (category_id),
          PRIMARY KEY(comic_id, category_id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE
          comic_category
        ADD
          CONSTRAINT FK_61B5EE79D663094A FOREIGN KEY (comic_id) REFERENCES comic (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE
          comic_category
        ADD
          CONSTRAINT FK_61B5EE7912469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE comic_category DROP FOREIGN KEY FK_61B5EE79D663094A');
        $this->addSql('ALTER TABLE comic_category DROP FOREIGN KEY FK_61B5EE7912469DE2');
        $this->addSql('DROP TABLE comic_category');
    }
}
