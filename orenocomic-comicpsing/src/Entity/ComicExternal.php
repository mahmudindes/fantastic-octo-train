<?php

namespace App\Entity;

use App\Repository\ComicExternalRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: ComicExternalRepository::class)]
#[ORM\Table(name: 'comic_external')]
#[ORM\UniqueConstraint(columns: ['comic_id', 'ulid'])]
#[ORM\UniqueConstraint(columns: ['comic_id', 'website_id', 'relative_url'])]
class ComicExternal
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: Types::BIGINT)]
    private ?int $id = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'externals')]
    #[ORM\JoinColumn(name:'comic_id', nullable: false, onDelete: 'CASCADE')]
    private ?Comic $comic = null;

    #[ORM\Column(type: 'ulid')]
    private ?Ulid $ulid = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name:'website_id', nullable: false)]
    private ?Website $website = null;

    #[ORM\Column(name:'relative_url', length: 128, nullable: true)]
    private ?string $relativeURL = null;

    #[ORM\Column(nullable: true)]
    private ?bool $official = null;

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

    public function getUlLID(): ?Ulid
    {
        return $this->ulid;
    }

    public function setULID(Ulid $ulid): static
    {
        $this->ulid = $ulid;

        return $this;
    }

    public function getWebsite(): ?Website
    {
        return $this->website;
    }

    public function setWebsite(?Website $website): static
    {
        $this->website = $website;

        return $this;
    }

    public function getRelativeURL(): ?string
    {
        return $this->relativeURL;
    }

    public function setRelativeURL(?string $relativeURL): static
    {
        $this->relativeURL = $relativeURL;

        return $this;
    }

    public function isOfficial(): ?bool
    {
        return $this->official;
    }

    public function setOfficial(?bool $official): static
    {
        $this->official = $official;

        return $this;
    }
}
