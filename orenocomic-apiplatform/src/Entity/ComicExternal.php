<?php

namespace App\Entity;

use ApiPlatform\Metadata as API;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\OpenApi\Model as OpenAPI;
use App\ApiState\ComicSubresourceInputProcessor;
use App\Repository\ComicExternalRepository;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\Uid\Ulid;
use Symfony\Component\Serializer\Annotation as Serializer;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ComicExternalRepository::class)]
#[ORM\Table(name: 'comic_external')]
#[ORM\UniqueConstraint(columns: ['comic_id', 'ulid'])]
#[ORM\UniqueConstraint(columns: ['comic_id', 'link_id'])]
#[ORM\HasLifecycleCallbacks]
#[API\ApiResource(
    operations: [
        new API\GetCollection(
            uriTemplate: '/comics/{comicCode}/externals{._format}',
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
            uriTemplate: '/comics/{comicCode}/externals{._format}',
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
            uriTemplate: '/comics/{comicCode}/externals/{ulid}{._format}',
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
            uriTemplate: '/comics/{comicCode}/externals/{ulid}{._format}',
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
            uriTemplate: '/comics/{comicCode}/externals/{ulid}{._format}',
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
            uriTemplate: '/comics/{comicCode}/externals/{ulid}{._format}',
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
class ComicExternal
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: Types::BIGINT)]
    #[API\ApiProperty(identifier: false)]
    private ?int $id = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    #[Serializer\Groups('comic', 'comicExternal')]
    #[API\ApiProperty(writable: false)]
    #[API\ApiFilter(OrderFilter::class)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    #[Serializer\Groups('comic', 'comicExternal')]
    #[API\ApiProperty(writable: false)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'externals')]
    #[ORM\JoinColumn(name:'comic_id', nullable: false, onDelete: 'CASCADE')]
    #[Serializer\Groups('comicExternal')]
    #[API\ApiProperty(writable: false)]
    private ?Comic $comic = null;

    #[Assert\NotBlank(allowNull: true)]
    #[Serializer\Groups('comicExternal')]
    private ?string $comicCode = null;

    #[ORM\Column(type: 'ulid')]
    #[Serializer\Groups('comic', 'comicExternal')]
    #[API\ApiProperty(identifier: true, writable: false)]
    #[API\ApiFilter(OrderFilter::class)]
    private ?Ulid $ulid = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name:'link_id', nullable: false, onDelete: 'CASCADE')]
    #[Serializer\Groups('comic', 'comicExternal')]
    #[API\ApiProperty(openapiContext: ['example' => 'string'])]
    #[API\ApiFilter(OrderFilter::class, properties: ['link.ulid'])]
    private ?Link $link = null;

    #[Assert\NotBlank(allowNull: true)]
    #[Serializer\Groups('comic', 'comicExternal')]
    private ?Ulid $linkULID = null;

    #[ORM\Column(nullable: true)]
    #[Serializer\Groups('comic', 'comicExternal')]
    #[API\ApiFilter(OrderFilter::class)]
    private ?bool $official = null;

    #[ORM\Column(nullable: true)]
    #[Serializer\Groups('comic', 'comicExternal')]
    #[API\ApiFilter(OrderFilter::class)]
    private ?bool $community = null;

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

    public function isOfficial(): ?bool
    {
        return $this->official;
    }

    public function setOfficial(?bool $official): static
    {
        $this->official = $official;

        return $this;
    }

    public function isCommunity(): ?bool
    {
        return $this->community;
    }

    public function setCommunity(?bool $community): static
    {
        $this->community = $community;

        return $this;
    }
}
