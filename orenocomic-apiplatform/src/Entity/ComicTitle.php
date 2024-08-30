<?php

namespace App\Entity;

use ApiPlatform\Metadata as API;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\OpenApi\Model as OpenAPI;
use App\ApiState\ComicSubresourceInputProcessor;
use App\Repository\ComicTitleRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\Serializer\Annotation as Serializer;
use Symfony\Component\Uid\Ulid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ComicTitleRepository::class)]
#[ORM\Table(name: 'comic_title')]
#[ORM\UniqueConstraint(columns: ['comic_id', 'ulid'])]
#[ORM\UniqueConstraint(columns: ['comic_id', 'title'])]
#[ORM\HasLifecycleCallbacks]
#[API\ApiResource(
    operations: [
        new API\GetCollection(
            uriTemplate: '/comics/{comicCode}/titles{._format}',
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
            uriTemplate: '/comics/{comicCode}/titles{._format}',
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
            uriTemplate: '/comics/{comicCode}/titles/{ulid}{._format}',
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
            uriTemplate: '/comics/{comicCode}/titles/{ulid}{._format}',
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
            uriTemplate: '/comics/{comicCode}/titles/{ulid}{._format}',
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
            uriTemplate: '/comics/{comicCode}/titles/{ulid}{._format}',
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
class ComicTitle
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: Types::BIGINT)]
    #[API\ApiProperty(identifier: false)]
    private ?int $id = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    #[Serializer\Groups('comic', 'comicTitle')]
    #[API\ApiProperty(writable: false)]
    #[API\ApiFilter(OrderFilter::class)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    #[Serializer\Groups('comic', 'comicTitle')]
    #[API\ApiProperty(writable: false)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'titles')]
    #[ORM\JoinColumn(name:'comic_id', nullable: false, onDelete: 'CASCADE')]
    #[Serializer\Groups('comicTitle')]
    #[API\ApiProperty(writable: false)]
    private ?Comic $comic = null;

    #[Assert\NotBlank(allowNull: true)]
    #[Serializer\Groups('comicTitle')]
    private ?string $comicCode = null;

    #[ORM\Column(type: 'ulid')]
    #[Serializer\Groups('comic', 'comicTitle')]
    #[API\ApiProperty(identifier: true, writable: false)]
    #[API\ApiFilter(OrderFilter::class)]
    private ?Ulid $ulid = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name:'language_id', nullable: false)]
    #[Serializer\Groups('comic', 'comicTitle')]
    #[API\ApiProperty(openapiContext: ['example' => 'string'])]
    #[API\ApiFilter(OrderFilter::class, properties: ['language.ietf'])]
    private ?Language $language = null;

    #[Assert\NotBlank(allowNull: true)]
    #[Serializer\Groups('comic', 'comicTitle')]
    private ?string $languageIETF = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank, Assert\Length(min: 1, max: 255)]
    #[Serializer\Groups('comic', 'comicTitle')]
    private ?string $title = null;

    #[ORM\Column(nullable: true)]
    #[Serializer\Groups('comic', 'comicTitle')]
    #[API\ApiFilter(OrderFilter::class)]
    private ?bool $synonym = null;

    #[ORM\Column(nullable: true)]
    #[Serializer\Groups('comic', 'comicTitle')]
    #[API\ApiFilter(OrderFilter::class)]
    private ?bool $romanized = null;

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
        if ($this->languageIETF) {
            $languageRepository = $entityManager->getRepository(Language::class);
            $this->setLanguage($languageRepository->findOneBy(['ietf' => $this->languageIETF]));
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

    public function getLanguage(): ?Language
    {
        return $this->language;
    }

    public function getLanguageIETF(): ?string
    {
        return $this->language->getIetf();
    }

    public function setLanguage(?Language $language): static
    {
        $this->language = $language;

        return $this;
    }

    public function setLanguageIETF(?string $languageIETF): static
    {
        $this->languageIETF = $languageIETF;

        return $this;
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

    public function setSynonym(?bool $synonym): static
    {
        $this->synonym = $synonym;

        return $this;
    }

    public function isRomanized(): ?bool
    {
        return $this->romanized;
    }

    public function setRomanized(?bool $romanized): static
    {
        $this->romanized = $romanized;

        return $this;
    }
}
