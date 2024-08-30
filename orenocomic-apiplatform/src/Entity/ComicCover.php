<?php

namespace App\Entity;

use ApiPlatform\Metadata as API;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\OpenApi\Model as OpenAPI;
use App\ApiState\ComicSubresourceInputProcessor;
use App\Repository\ComicCoverRepository;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\Uid\Ulid;
use Symfony\Component\Serializer\Annotation as Serializer;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ComicCoverRepository::class)]
#[ORM\Table(name: 'comic_cover')]
#[ORM\UniqueConstraint(columns: ['comic_id', 'ulid'])]
#[ORM\UniqueConstraint(columns: ['comic_id', 'link_id'])]
#[ORM\HasLifecycleCallbacks]
#[API\ApiResource(
    operations: [
        new API\GetCollection(
            uriTemplate: '/comics/{comicCode}/covers{._format}',
            uriVariables: [
                'comicCode' => new API\Link(
                    fromClass: Comic::class,
                    fromProperty: 'code',
                    toProperty: 'comic'
                )
            ],
            order: ['ulid']
        ),
        new API\Post(
            uriTemplate: '/comics/{comicCode}/covers{._format}',
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
            uriTemplate: '/comics/{comicCode}/covers/{ulid}{._format}',
            uriVariables: [
                'comicCode' => new API\Link(
                    fromClass: Comic::class,
                    fromProperty: 'code',
                    toProperty: 'comic'
                ),
                'ulid'
            ]
        ),
        new API\Put(
            uriTemplate: '/comics/{comicCode}/covers/{ulid}{._format}',
            uriVariables: [
                'comicCode' => new API\Link(
                    fromClass: Comic::class,
                    fromProperty: 'code',
                    toProperty: 'comic'
                ),
                'ulid'
            ],
            processor: ComicSubresourceInputProcessor::class
        ),
        new API\Delete(
            uriTemplate: '/comics/{comicCode}/covers/{ulid}{._format}',
            uriVariables: [
                'comicCode' => new API\Link(
                    fromClass: Comic::class,
                    fromProperty: 'code',
                    toProperty: 'comic'
                ),
                'ulid'
            ]
        ),
        new API\Patch(
            uriTemplate: '/comics/{comicCode}/covers/{ulid}{._format}',
            uriVariables: [
                'comicCode' => new API\Link(
                    fromClass: Comic::class,
                    fromProperty: 'code',
                    toProperty: 'comic'
                ),
                'ulid'
            ],
            processor: ComicSubresourceInputProcessor::class
        )
    ],
    normalizationContext: ['groups' => ['comic']],
    denormalizationContext: ['groups' => ['comic']],
    openapi: new OpenAPI\Operation(tags: ['Comic'])
)]
class ComicCover
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: Types::BIGINT)]
    #[API\ApiProperty(identifier: false)]
    private ?int $id = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    #[Serializer\Groups('comic', 'comicCover')]
    #[API\ApiProperty(writable: false)]
    #[API\ApiFilter(OrderFilter::class)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    #[Serializer\Groups('comic', 'comicCover')]
    #[API\ApiProperty(writable: false)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'covers')]
    #[ORM\JoinColumn(name:'comic_id', nullable: false, onDelete: 'CASCADE')]
    #[Serializer\Groups('comicCover')]
    #[API\ApiProperty(writable: false)]
    private ?Comic $comic = null;

    #[Assert\NotBlank(allowNull: true)]
    #[Serializer\Groups('comicCover')]
    private ?string $comicCode = null;

    #[ORM\Column(type: 'ulid')]
    #[Serializer\Groups('comic', 'comicCover')]
    #[API\ApiProperty(identifier: true, writable: false)]
    #[API\ApiFilter(OrderFilter::class)]
    private ?Ulid $ulid = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name:'link_id', nullable: false, onDelete: 'CASCADE')]
    #[Serializer\Groups('comic', 'comicCover')]
    #[API\ApiProperty(openapiContext: ['example' => 'string'])]
    #[API\ApiFilter(OrderFilter::class, properties: ['link.ulid'])]
    private ?Link $link = null;

    #[Assert\NotBlank(allowNull: true)]
    #[Serializer\Groups('comic', 'comicCover')]
    private ?Ulid $linkULID = null;

    #[ORM\Column(length: 64, nullable: true)]
    #[Assert\NotBlank(allowNull: true), Assert\Length(min: 1, max: 64)]
    #[Serializer\Groups('comic', 'comicCover')]
    #[API\ApiFilter(OrderFilter::class)]
    private ?string $hint = null;

    #[ORM\PrePersist]
    public function onPrePersist(PrePersistEventArgs $args)
    {
        $this->setCreatedAt(new \DateTimeImmutable());
        $this->setUlid(new Ulid());
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

        if ($this->comicCode) {
            $comicRepository = $entityManager->getRepository(Comic::class);
            $this->setComic($comicRepository->findOneBy(['code' => $this->comicCode]));
        }
        if ($this->linkULID) {
            $linkRepository = $entityManager->getRepository(Link::class);
            $this->setLink($linkRepository->findOneBy(['ulid' => $this->linkULID]));
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

    public function getComic(): ?Comic
    {
        return $this->comic;
    }

    public function getComicCode(): ?string
    {
        return $this->comic->getCode();
    }

    public function setComic(?Comic $comic): static
    {
        $this->comic = $comic;

        return $this;
    }

    public function setComicCode(?string $comicCode): static
    {
        $this->comicCode = $comicCode;

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

    public function getLinkULID(): ?Ulid
    {
        return $this->link->getUlid();
    }

    public function setLink(?Link $link): static
    {
        $this->link = $link;

        return $this;
    }

    public function setLinkULID(?Ulid $linkULID): static
    {
        $this->linkULID = $linkULID;

        return $this;
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
