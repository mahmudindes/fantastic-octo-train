<?php

namespace App\Entity;

use ApiPlatform\Metadata as API;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\OpenApi\Model as OpenAPI;
use App\Repository\TagRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\Serializer\Annotation as Serializer;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: TagRepository::class)]
#[ORM\Table(name: 'tag')]
#[ORM\UniqueConstraint(columns: ['type_id', 'code'])]
#[ORM\HasLifecycleCallbacks]
#[API\ApiResource(
    operations: [
        new API\GetCollection(
            uriTemplate: '/tags{._format}',
            order: ['type.code', 'code']
        ),
        new API\Post(
            uriTemplate: '/tags{._format}'
        ),
        new API\Get(
            uriTemplate: '/tags/{typeCode}:{code}{._format}',
            uriVariables: [
                'typeCode' => new API\Link(
                    fromClass: TagKind::class,
                    fromProperty: 'code',
                    toProperty: 'type'
                ),
                'code'
            ]
        ),
        new API\Put(
            uriTemplate: '/tags/{typeCode}:{code}{._format}',
            uriVariables: [
                'typeCode' => new API\Link(
                    fromClass: TagKind::class,
                    fromProperty: 'code',
                    toProperty: 'type'
                ),
                'code'
            ]
        ),
        new API\Delete(
            uriTemplate: '/tags/{typeCode}:{code}{._format}',
            uriVariables: [
                'typeCode' => new API\Link(
                    fromClass: TagKind::class,
                    fromProperty: 'code',
                    toProperty: 'type'
                ),
                'code'
            ]
        ),
        new API\Patch(
            uriTemplate: '/tags/{typeCode}:{code}{._format}',
            uriVariables: [
                'typeCode' => new API\Link(
                    fromClass: TagKind::class,
                    fromProperty: 'code',
                    toProperty: 'type'
                ),
                'code'
            ]
        )
    ],
    normalizationContext: ['groups' => ['tag']],
    denormalizationContext: ['groups' => ['tag']],
    openapi: new OpenAPI\Operation(tags: ['Tag'])
)]
class Tag
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: Types::BIGINT)]
    #[API\ApiProperty(identifier: false)]
    private ?int $id = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    #[Serializer\Groups('tag')]
    #[API\ApiProperty(writable: false)]
    #[API\ApiFilter(OrderFilter::class)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    #[Serializer\Groups('tag')]
    #[API\ApiProperty(writable: false)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name:'type_id', nullable: false)]
    #[Serializer\Groups('tag')]
    #[API\ApiProperty(openapiContext: ['example' => 'string'])]
    #[API\ApiFilter(OrderFilter::class, properties: ['type.code'])]
    private ?TagKind $type = null;

    #[Assert\NotBlank(allowNull: true)]
    #[Serializer\Groups('tag')]
    private ?string $typeCode = null;

    #[ORM\Column(length: 32)]
    #[Assert\NotBlank, Assert\Length(min: 1, max: 32)]
    #[Serializer\Groups('tag')]
    #[API\ApiFilter(OrderFilter::class)]
    private ?string $code = null;

    #[ORM\Column(length: 32)]
    #[Assert\NotBlank, Assert\Length(min: 1, max: 32)]
    #[Serializer\Groups('tag')]
    #[API\ApiFilter(OrderFilter::class)]
    private ?string $name = null;

    #[ORM\PrePersist]
    public function onPrePersist(PrePersistEventArgs $args)
    {
        $this->setCreatedAt(new \DateTimeImmutable());
        $this->onPreInputted($args);
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(PreUpdateEventArgs $args)
    {
        $this->setUpdatedAt(new \DateTimeImmutable());
        $this->onPreInputted($args);
    }

    public function onPreInputted(LifecycleEventArgs $args)
    {
        $entityManager = $args->getObjectManager();

        if ($this->typeCode) {
            $tagKindRepository = $entityManager->getRepository(TagKind::class);
            $this->setType($tagKindRepository->findOneBy(['code' => $this->typeCode]));
        }
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

    public function getTypeCode(): ?string
    {
        return $this->type->getCode();
    }

    public function setType(?TagKind $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function setTypeCode(?string $typeCode): static
    {
        $this->typeCode = $typeCode;

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

    #[Serializer\Ignore]
    #[API\ApiProperty(identifier: true)]
    public function getTypeCodeCode(): ?string
    {
        return $this->getTypeCode() . ':' . $this->getCode();
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
