<?php

namespace App\Entity;

use ApiPlatform\Metadata as API;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\OpenApi\Model as OpenAPI;
use App\Repository\CategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\Serializer\Annotation as Serializer;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CategoryRepository::class)]
#[ORM\Table(name: 'category')]
#[ORM\UniqueConstraint(columns: ['type_id', 'code'])]
#[ORM\HasLifecycleCallbacks]
#[API\ApiResource(
    operations: [
        new API\GetCollection(
            uriTemplate: '/categories{._format}',
            order: ['type.code', 'code']
        ),
        new API\Post(
            uriTemplate: '/categories{._format}'
        ),
        new API\Get(
            uriTemplate: '/categories/{typeCode}:{code}{._format}',
            uriVariables: [
                'typeCode' => new API\Link(
                    fromClass: CategoryKind::class,
                    fromProperty: 'code',
                    toProperty: 'type'
                ),
                'code'
            ]
        ),
        new API\Put(
            uriTemplate: '/categories/{typeCode}:{code}{._format}',
            uriVariables: [
                'typeCode' => new API\Link(
                    fromClass: CategoryKind::class,
                    fromProperty: 'code',
                    toProperty: 'type'
                ),
                'code'
            ]
        ),
        new API\Delete(
            uriTemplate: '/categories/{typeCode}:{code}{._format}',
            uriVariables: [
                'typeCode' => new API\Link(
                    fromClass: CategoryKind::class,
                    fromProperty: 'code',
                    toProperty: 'type'
                ),
                'code'
            ]
        ),
        new API\Patch(
            uriTemplate: '/categories/{typeCode}:{code}{._format}',
            uriVariables: [
                'typeCode' => new API\Link(
                    fromClass: CategoryKind::class,
                    fromProperty: 'code',
                    toProperty: 'type'
                ),
                'code'
            ]
        )
    ],
    normalizationContext: ['enable_max_depth' => true, 'groups' => ['category']],
    denormalizationContext: ['groups' => ['category']],
    openapi: new OpenAPI\Operation(tags: ['Category'])
)]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: Types::BIGINT)]
    #[API\ApiProperty(identifier: false)]
    private ?int $id = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    #[Serializer\Groups('category')]
    #[API\ApiProperty(writable: false)]
    #[API\ApiFilter(OrderFilter::class)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    #[Serializer\Groups('category')]
    #[API\ApiProperty(writable: false)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name:'type_id', nullable: false)]
    #[Serializer\Groups('category')]
    #[API\ApiProperty(openapiContext: ['example' => 'string'])]
    #[API\ApiFilter(OrderFilter::class, properties: ['type.code'])]
    private ?CategoryKind $type = null;

    #[Assert\NotBlank(allowNull: true)]
    #[Serializer\Groups('category')]
    private ?string $typeCode = null;

    #[ORM\Column(length: 32)]
    #[Assert\NotBlank, Assert\Length(min: 1, max: 32)]
    #[Serializer\Groups('category')]
    #[API\ApiFilter(OrderFilter::class)]
    private ?string $code = null;

    #[ORM\Column(length: 32)]
    #[Assert\NotBlank, Assert\Length(min: 1, max: 32)]
    #[Serializer\Groups('category')]
    #[API\ApiFilter(OrderFilter::class)]
    private ?string $name = null;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    #[ORM\JoinColumn(name:'parent_id', onDelete: 'CASCADE')]
    #[Serializer\Groups('category')]
    #[API\ApiProperty(readable: false)]
    #[API\ApiFilter(OrderFilter::class, properties: ['parent.code'])]
    private ?self $parent = null;

    #[Assert\NotBlank(allowNull: true)]
    #[Serializer\Groups('category')]
    #[API\ApiProperty(readable: false)]
    private ?string $parentCode = null;

    /**
     * @var Collection<int, self>
     */
    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'parent')]
    #[Serializer\MaxDepth(1), Serializer\Groups('category')]
    #[API\ApiProperty(writable: false, openapiContext: ['example' => []])]
    private Collection $children;

    public function __construct()
    {
        $this->children = new ArrayCollection();
    }

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
            $categoryKindRepository = $entityManager->getRepository(CategoryKind::class);
            $this->setType($categoryKindRepository->findOneBy(['code' => $this->typeCode]));
        }
        if ($this->parentCode) {
            $categoryRepository = $entityManager->getRepository(Category::class);
            $this->setParent($categoryRepository->findOneBy([
                'type' => $this->getType(),
                'code' => $this->parentCode
            ]));
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

    public function getType(): ?CategoryKind
    {
        return $this->type;
    }

    public function getTypeCode(): ?string
    {
        return $this->type->getCode();
    }

    public function setType(?CategoryKind $type): static
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

    public function getParent(): ?self
    {
        return $this->parent;
    }

    public function getParentCode(): ?string
    {
        if (!$this->parent) {
            return null;
        }

        return $this->parent->getCode();
    }

    public function setParent(?self $parent): static
    {
        $this->parent = $parent;

        return $this;
    }

    public function setParentCode(?string $parentCode): static
    {
        $this->parentCode = $parentCode;

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getChildren(): Collection
    {
        return $this->children;
    }

    #[Serializer\Groups('category')]
    public function getChildrenCount(): ?int
    {
        return $this->children->count();
    }

    public function addChild(self $child): static
    {
        if (!$this->children->contains($child)) {
            $this->children->add($child);
            $child->setParent($this);
        }

        return $this;
    }

    public function removeChild(self $child): static
    {
        if ($this->children->removeElement($child)) {
            // set the owning side to null (unless already changed)
            if ($child->getParent() === $this) {
                $child->setParent(null);
            }
        }

        return $this;
    }
}
