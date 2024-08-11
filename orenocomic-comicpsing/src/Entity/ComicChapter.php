<?php

namespace App\Entity;

use App\Repository\ComicChapterRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ComicChapterRepository::class)]
#[ORM\Table(name: 'comic_chapter')]
#[ORM\UniqueConstraint(columns: ['comic_id', 'chapter', 'version'])] // Need custom index for distinct null.
class ComicChapter
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: Types::BIGINT)]
    private ?int $id = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'chapters')]
    #[ORM\JoinColumn(name:'comic_id', nullable: false, onDelete: 'CASCADE')]
    private ?Comic $comic = null;

    #[ORM\Column(length: 64)]
    private ?string $chapter = null;

    #[ORM\Column(length: 32, nullable: true)]
    private ?string $version = null;

    #[ORM\ManyToOne(inversedBy: 'chapters')]
    #[ORM\JoinColumn(name:'volume_id')]
    private ?ComicVolume $volume = null;

    #[ORM\Column(name: 'released_at', type: Types::DATETIMETZ_IMMUTABLE)]
    private ?\DateTimeImmutable $releasedAt = null;

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

    public function getChapter(): ?string
    {
        return $this->chapter;
    }

    public function setChapter(string $chapter): static
    {
        $this->chapter = $chapter;

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

    public function getVolume(): ?ComicVolume
    {
        return $this->volume;
    }

    public function setVolume(?ComicVolume $volume): static
    {
        $this->volume = $volume;

        return $this;
    }

    public function getReleasedAt(): ?\DateTimeImmutable
    {
        return $this->releasedAt;
    }

    public function setReleasedAt(\DateTimeImmutable $releasedAt): static
    {
        $this->releasedAt = $releasedAt;

        return $this;
    }
}
