<?php

namespace App\Entity;

use App\Repository\ComicSynopsisRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: ComicSynopsisRepository::class)]
#[ORM\Table(name: 'comic_synopsis')]
#[ORM\UniqueConstraint(columns: ['comic_id', 'ulid'])]
#[ORM\UniqueConstraint(columns: ['comic_id', 'synopsis'])]
class ComicSynopsis
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: Types::BIGINT)]
    private ?int $id = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'synopses')]
    #[ORM\JoinColumn(name:'comic_id', nullable: false, onDelete: 'CASCADE')]
    private ?Comic $comic = null;

    #[ORM\Column(type: 'ulid')]
    private ?Ulid $ulid = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name:'language_id', nullable: false)]
    private ?Language $language = null;

    #[ORM\Column(length: 2048)]
    private ?string $synopsis = null;

    #[ORM\Column(length: 16, nullable: true)]
    private ?string $version = null;

    #[ORM\Column(nullable: true)]
    private ?bool $romanized = null;

    public function getID(): ?int
    {
        return $this->id;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getComic(): ?Comic
    {
        return $this->comic;
    }

    public function setComic(?Comic $comic): static
    {
        $this->comic = $comic;

        return $this;
    }

    public function getULID(): ?Ulid
    {
        return $this->ulid;
    }

    public function setULID(Ulid $ulid): static
    {
        $this->ulid = $ulid;

        return $this;
    }

    public function getLanguage(): ?Language
    {
        return $this->language;
    }

    public function setLanguage(?Language $language): static
    {
        $this->language = $language;

        return $this;
    }

    public function getSynopsis(): ?string
    {
        return $this->synopsis;
    }

    public function setSynopsis(string $synopsis): static
    {
        $this->synopsis = $synopsis;

        return $this;
    }

    public function getVersion(): ?string
    {
        return $this->version;
    }

    public function setVersion(?string $version): static
    {
        $this->version = $version;

        return $this;
    }

    public function isRomanized(): ?bool
    {
        return $this->romanized;
    }

    public function setRomanized(?bool $romanized): static
    {
        $this->romanized = $romanized;

        return $this;
    }
}
