<?php

namespace App\Entity;

use App\Repository\ComicTitleRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Ulid;
use Symfony\Component\Serializer\Annotation as Serializer;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ComicTitleRepository::class)]
#[ORM\Table(name: 'comic_title')]
#[ORM\UniqueConstraint(columns: ['comic_id', 'ulid'])]
#[ORM\UniqueConstraint(columns: ['comic_id', 'title'])]
#[ORM\HasLifecycleCallbacks]
class ComicTitle
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: Types::BIGINT)]
    private ?int $id = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'titles')]
    #[ORM\JoinColumn(name:'comic_id', nullable: false, onDelete: 'CASCADE')]
    #[Serializer\Ignore]
    private ?Comic $comic = null;

    #[ORM\Column(type: 'ulid')]
    private ?Ulid $ulid = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name:'language_id', nullable: false)]
    #[Serializer\Ignore]
    private ?Language $language = null;

    #[ORM\Column(length: 255)]
    #[Assert\Length(min: 1, max: 255)]
    private ?string $title = null;

    #[ORM\Column]
    private ?bool $synonym = null;

    #[ORM\Column(nullable: true)]
    private ?bool $romanized = null;

    #[ORM\PrePersist]
    public function onPrePersist()
    {
        $this->setCreatedAt(new \DateTimeImmutable());
        $this->setUlid(new Ulid());
    }

    #[ORM\PreUpdate]
    public function onPreUpdate()
    {
        $this->setUpdatedAt(new \DateTimeImmutable());
    }

    public function getId(): ?int
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

    public function getUlid(): ?Ulid
    {
        return $this->ulid;
    }

    public function setUlid(Ulid $ulid): static
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

    public function getLanguageIETF(): ?string
    {
        return $this->language->getIetf();
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function isSynonym(): ?bool
    {
        return $this->synonym;
    }

    public function setSynonym(bool $synonym): static
    {
        $this->synonym = $synonym;

        return $this;
    }

    public function isRomanized(): ?bool
    {
        return $this->romanized;
    }

    public function setRomanized(bool $romanized): static
    {
        $this->romanized = $romanized;

        return $this;
    }
}
