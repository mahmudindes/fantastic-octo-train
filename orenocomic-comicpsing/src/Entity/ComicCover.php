<?php

namespace App\Entity;

use App\Repository\ComicCoverRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Ulid;
use Symfony\Component\Serializer\Annotation as Serializer;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ComicCoverRepository::class)]
#[ORM\Table(name: 'comic_cover')]
#[ORM\UniqueConstraint(columns: ['comic_id', 'ulid'])]
#[ORM\UniqueConstraint(columns: ['comic_id', 'link_id'])]
#[ORM\HasLifecycleCallbacks]
class ComicCover
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: Types::BIGINT)]
    private ?int $id = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'covers')]
    #[ORM\JoinColumn(name:'comic_id', nullable: false, onDelete: 'CASCADE')]
    #[Serializer\Ignore]
    private ?Comic $comic = null;

    #[ORM\Column(type: 'ulid')]
    private ?Ulid $ulid = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name:'link_id', nullable: false, onDelete: 'CASCADE')]
    #[Serializer\Ignore]
    private ?Link $link = null;

    #[ORM\Column(length: 64, nullable: true)]
    #[Assert\Length(min: 1, max: 64)]
    private ?string $hint = null;

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

    public function getLink(): ?Link
    {
        return $this->link;
    }

    public function setLink(?Link $link): static
    {
        $this->link = $link;

        return $this;
    }

    public function getLinkUlid(): ?Ulid
    {
        return $this->link->getUlid();
    }

    public function getHint(): ?string
    {
        return $this->hint;
    }

    public function setHint(?string $hint): static
    {
        $this->hint = $hint;

        return $this;
    }
}
