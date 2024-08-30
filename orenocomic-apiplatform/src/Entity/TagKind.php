<?php

namespace App\Entity;

use ApiPlatform\Metadata as API;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\OpenApi\Model as OpenAPI;
use App\Repository\TagKindRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation as Serializer;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: TagKindRepository::class)]
#[ORM\Table(name: 'tag_type')]
#[ORM\HasLifecycleCallbacks]
#[API\ApiResource(
    shortName: 'TagType',
    operations: [
        new API\GetCollection(
            uriTemplate: '/tag-types{._format}',
            order: ['code']
        ),
        new API\Post(
            uriTemplate: '/tag-types{._format}'
        ),
        new API\Get(
            uriTemplate: '/tag-types/{code}{._format}'
        ),
        new API\Put(
            uriTemplate: '/tag-types/{code}{._format}'
        ),
        new API\Delete(
            uriTemplate: '/tag-types/{code}{._format}'
        ),
        new API\Patch(
            uriTemplate: '/tag-types/{code}{._format}'
        )
    ],
    normalizationContext: ['groups' => ['tagType']],
    denormalizationContext: ['groups' => ['tagType']],
    openapi: new OpenAPI\Operation(tags: ['Tag'])
)]
class TagKind
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: Types::BIGINT)]
    #[API\ApiProperty(identifier: false)]
    private ?int $id = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    #[Serializer\Groups('tagType')]
    #[API\ApiProperty(writable: false)]
    #[API\ApiFilter(OrderFilter::class)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    #[Serializer\Groups('tagType')]
    #[API\ApiProperty(writable: false)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(length: 32, unique: true)]
    #[Assert\NotBlank, Assert\Length(min: 1, max: 32)]
    #[Serializer\Groups('tagType')]
    #[API\ApiProperty(identifier: true)]
    #[API\ApiFilter(OrderFilter::class)]
    private ?string $code = null;

    #[ORM\Column(length: 32)]
    #[Assert\NotBlank, Assert\Length(min: 1, max: 32)]
    #[Serializer\Groups('tagType')]
    #[API\ApiFilter(OrderFilter::class)]
    private ?string $name = null;

    #[ORM\PrePersist]
    public function onPrePersist(PrePersistEventArgs $args)
    {
        $this->setCreatedAt(new \DateTimeImmutable());
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(PreUpdateEventArgs $args)
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
