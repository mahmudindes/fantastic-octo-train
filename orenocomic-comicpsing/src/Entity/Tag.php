<?php

namespace App\Entity;

use App\Repository\TagRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation as Serializer;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: TagRepository::class)]
#[ORM\Table(name: 'tag')]
#[ORM\UniqueConstraint(columns: ['type_id', 'code'])]
#[ORM\HasLifecycleCallbacks]
class Tag
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: Types::BIGINT)]
    private ?int $id = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name:'type_id', nullable: false)]
    #[Serializer\Ignore]
    private ?TagKind $type = null;

    #[ORM\Column(length: 32)]
    #[Assert\Length(min: 1, max: 32)]
    private ?string $code = null;

    #[ORM\Column(length: 32)]
    #[Assert\Length(min: 1, max: 32)]
    private ?string $name = null;

    #[ORM\PrePersist]
    public function onPrePersist()
    {
        $this->setCreatedAt(new \DateTimeImmutable());
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

    public function getType(): ?TagKind
    {
        return $this->type;
    }

    public function setType(?TagKind $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getTypeCode(): ?string
    {
        return $this->type->getCode();
    }

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): static
    {
        $this->code = $code;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }
}
