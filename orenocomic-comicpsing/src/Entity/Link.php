<?php

namespace App\Entity;

use App\Repository\LinkRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Ulid;
use Symfony\Component\Serializer\Annotation as Serializer;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: LinkRepository::class)]
#[ORM\Table(name: 'link')]
#[ORM\UniqueConstraint(columns: ['website_id', 'relative_url'])]
#[ORM\HasLifecycleCallbacks]
class Link
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: Types::BIGINT)]
    private ?int $id = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(type: 'ulid', unique: true)]
    private ?Ulid $ulid = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name:'website_id', nullable: false, onDelete: 'CASCADE')]
    #[Serializer\Ignore]
    private ?Website $website = null;

    #[ORM\Column(name:'relative_url', length: 128, nullable: true)]
    #[Assert\Length(min: 1, max:128)]
    #[Assert\Regex('/^\//')]
    private ?string $relativeURL = null;

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

    public function getUlid(): ?Ulid
    {
        return $this->ulid;
    }

    public function setUlid(Ulid $ulid): static
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

    public function getWebsiteDomain(): ?string
    {
        return $this->website->getDomain();
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
}
