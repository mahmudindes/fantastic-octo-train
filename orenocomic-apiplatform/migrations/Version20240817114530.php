<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240817114530 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE
          comic_synopsis
        CHANGE
          synopsis synopsis VARCHAR(2040) NOT NULL,
        CHANGE
          version version VARCHAR(32) DEFAULT NULL');
        $this->addSql('ALTER TABLE
          website
        CHANGE
          domain domain VARCHAR(64) NOT NULL,
        CHANGE
          name name VARCHAR(64) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE
          website
        CHANGE
          domain domain VARCHAR(32) NOT NULL,
        CHANGE
          name name VARCHAR(32) NOT NULL');
        $this->addSql('ALTER TABLE
          comic_synopsis
        CHANGE
          synopsis synopsis VARCHAR(2048) NOT NULL,
        CHANGE
          version version VARCHAR(16) DEFAULT NULL');
    }
}
