<?php

namespace App\Entity;

use ApiPlatform\Metadata as API;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\OpenApi\Model as OpenAPI;
use App\ApiState\ComicSubresourceInputProcessor;
use App\ApiState\ComicCategoryItemProvider;
use App\Repository\ComicCategoryRepository;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\Serializer\Annotation as Serializer;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ComicCategoryRepository::class)]
#[ORM\Table(name: 'comic_category')]
#[ORM\HasLifecycleCallbacks]
#[API\ApiResource(
    operations: [
        new API\GetCollection(
            uriTemplate: '/comics/{comicCode}/categories{._format}',
            uriVariables: [
                'comicCode' => new API\Link(
                    fromClass: Comic::class,
                    fromProperty: 'code',
                    toProperty: 'comic'
                )
            ],
            // order: ['category.type.code', 'category.code']
        ),
        new API\Post(
            uriTemplate: '/comics/{comicCode}/categories{._format}',
            uriVariables: [
                'comicCode' => new API\Link(
                    fromClass: Comic::class,
                    fromProperty: 'code',
                    toProperty: 'comic'
                )
            ],
            processor: ComicSubresourceInputProcessor::class
        ),
        new API\Get(
            uriTemplate: '/comics/{comicCode}/categories/{typeCode}:{code}{._format}',
            uriVariables: [
                'comicCode' => new API\Link(
                    fromClass: Comic::class,
                    fromProperty: 'code',
                    toProperty: 'comic'
                ),
                'typeCode' => new API\Link(
                    fromClass: Category::class,
                    toProperty: 'category'
                ),
                'code' => new API\Link(
                    fromClass: Category::class,
                    fromProperty: 'code',
                    toProperty: 'category'
                )
            ],
            provider: ComicCategoryItemProvider::class
        ),
        new API\Put(
            uriTemplate: '/comics/{comicCode}/categories/{typeCode}:{code}{._format}',
            uriVariables: [
                'comicCode' => new API\Link(
                    fromClass: Comic::class,
                    fromProperty: 'code',
                    toProperty: 'comic'
                ),
                'typeCode' => new API\Link(
                    fromClass: Category::class,
                    toProperty: 'category'
                ),
                'code' => new API\Link(
                    fromClass: Category::class,
                    fromProperty: 'code',
                    toProperty: 'category'
                )
            ],
            provider: ComicCategoryItemProvider::class,
            processor: ComicSubresourceInputProcessor::class
        ),
        new API\Delete(
            uriTemplate: '/comics/{comicCode}/categories/{typeCode}:{code}{._format}',
            uriVariables: [
                'comicCode' => new API\Link(
                    fromClass: Comic::class,
                    fromProperty: 'code',
                    toProperty: 'comic'
                ),
                'typeCode' => new API\Link(
                    fromClass: Category::class,
                    toProperty: 'category'
                ),
                'code' => new API\Link(
                    fromClass: Category::class,
                    fromProperty: 'code',
                    toProperty: 'category'
                )
            ],
            provider: ComicCategoryItemProvider::class
        ),
        new API\Patch(
            uriTemplate: '/comics/{comicCode}/categories/{typeCode}:{code}{._format}',
            uriVariables: [
                'comicCode' => new API\Link(
                    fromClass: Comic::class,
                    fromProperty: 'code',
                    toProperty: 'comic'
                ),
                'typeCode' => new API\Link(
                    fromClass: Category::class,
                    toProperty: 'category'
                ),
                'code' => new API\Link(
                    fromClass: Category::class,
                    fromProperty: 'code',
                    toProperty: 'category'
                )
            ],
            provider: ComicCategoryItemProvider::class,
            processor: ComicSubresourceInputProcessor::class
        )
    ],
    normalizationContext: ['groups' => ['comic', 'category']],
    denormalizationContext: ['groups' => ['comic']],
    openapi: new OpenAPI\Operation(tags: ['Comic'])
)]
class ComicCategory
{
    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    #[Serializer\Groups('comic', 'comicCategory')]
    #[API\ApiProperty(writable: false)]
    #[API\ApiFilter(OrderFilter::class)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'categories')]
    #[ORM\JoinColumn(name:'comic_id', nullable: false, onDelete: 'CASCADE')]
    #[Serializer\Groups('comicCategory')]
    #[API\ApiProperty(identifier: false, writable: false)]
    private ?Comic $comic = null;

    #[Assert\NotBlank(allowNull: true)]
    #[Serializer\Groups('comicCategory')]
    private ?string $comicCode = null;

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name:'category_id', nullable: false, onDelete: 'CASCADE')]
    #[Serializer\Groups('comic', 'comicCategory')]
    #[API\ApiProperty(identifier: false, openapiContext: ['example' => 'string'])]
    #[API\ApiFilter(OrderFilter::class, properties: ['category.type.code', 'category.code'])]
    private ?Category $category = null;

    #[ORM\PrePersist]
    public function onPrePersist(PrePersistEventArgs $args)
    {
        $this->setCreatedAt(new \DateTimeImmutable());
        $this->onPreInputted($args);
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(PreUpdateEventArgs $args)
    {
        $this->onPreInputted($args);
    }

    public function onPreInputted(LifecycleEventArgs $args)
    {
        $entityManager = $args->getObjectManager();

        if ($this->comicCode) {
            $comicRepository = $entityManager->getRepository(Comic::class);
            $this->setComic($comicRepository->findOneBy(['code' => $this->comicCode]));
        }
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

    public function getComic(): ?Comic
    {
        return $this->comic;
    }

    public function setComic(?Comic $comic): static
    {
        $this->comic = $comic;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }

    #[Serializer\Ignore]
    #[API\ApiProperty(identifier: true)]
    public function getTypeCodeCode(): ?string
    {
        return $this->category->getTypeCode() . ':' . $this->category->getCode();
    }
}
