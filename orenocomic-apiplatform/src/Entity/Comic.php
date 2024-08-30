<?php

namespace App\Entity;

use ApiPlatform\Metadata as API;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\OpenApi\Model as OpenAPI;
use App\Repository\ComicRepository;
use App\Util\StringUtil;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\Serializer\Annotation as Serializer;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ComicRepository::class)]
#[ORM\Table(name: 'comic')]
#[ORM\HasLifecycleCallbacks]
#[API\ApiResource(
    operations: [
        new API\GetCollection(
            uriTemplate: '/comics{._format}',
            order: ['code']
        ),
        new API\Post(
            uriTemplate: '/comics{._format}'
        ),
        new API\Get(
            uriTemplate: '/comics/{code}{._format}'
        ),
        new API\Put(
            uriTemplate: '/comics/{code}{._format}'
        ),
        new API\Delete(
            uriTemplate: '/comics/{code}{._format}'
        ),
        new API\Patch(
            uriTemplate: '/comics/{code}{._format}'
        )
    ],
    normalizationContext: ['groups' => ['comic']],
    denormalizationContext: ['groups' => ['comic']],
    openapi: new OpenAPI\Operation(tags: ['Comic'])
)]
class Comic
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: Types::BIGINT)]
    #[API\ApiProperty(identifier: false)]
    private ?int $id = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    #[Serializer\Groups('comic')]
    #[API\ApiProperty(writable: false)]
    #[API\ApiFilter(OrderFilter::class)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    #[Serializer\Groups('comic')]
    #[API\ApiProperty(writable: false)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(length: 8, unique: true)]
    #[Assert\NotBlank(allowNull: true), Assert\Length(8)]
    #[Serializer\Groups('comic')]
    #[API\ApiProperty(identifier: true, writable: false)]
    #[API\ApiFilter(OrderFilter::class)]
    private ?string $code = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name:'language_id')]
    #[Serializer\Groups('comic')]
    #[API\ApiProperty(openapiContext: ['example' => 'string'])]
    #[API\ApiFilter(OrderFilter::class, properties: ['language.ietf'])]
    private ?Language $language = null;

    #[Assert\NotBlank(allowNull: true)]
    #[Serializer\Groups('comic')]
    private ?string $languageIETF = null;

    #[ORM\Column(name: 'published_from', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    #[Serializer\Groups('comic')]
    #[API\ApiFilter(OrderFilter::class)]
    private ?\DateTimeImmutable $publishedFrom = null;

    #[ORM\Column(name: 'published_to', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    #[Serializer\Groups('comic')]
    #[API\ApiFilter(OrderFilter::class)]
    private ?\DateTimeImmutable $publishedTo = null;

    #[ORM\Column(nullable: true)]
    #[Assert\Positive]
    #[Serializer\Groups('comic')]
    #[API\ApiFilter(OrderFilter::class)]
    private ?int $totalChapter = null;

    #[ORM\Column(nullable: true)]
    #[Assert\Positive]
    #[Serializer\Groups('comic')]
    #[API\ApiFilter(OrderFilter::class)]
    private ?int $totalVolume = null;

    #[ORM\Column(type: Types::SMALLINT, nullable: true)]
    #[Assert\Range(min: -1, max: 1)]
    #[Serializer\Groups('comic')]
    #[API\ApiFilter(OrderFilter::class)]
    private ?int $nsfw = null;

    #[ORM\Column(type: Types::SMALLINT, nullable: true)]
    #[Assert\Range(min: -1, max: 1)]
    #[Serializer\Groups('comic')]
    #[API\ApiFilter(OrderFilter::class)]
    private ?int $nsfl = null;

    #[ORM\Column(nullable: true)]
    #[Serializer\Groups('comic')]
    #[API\ApiProperty(openapiContext: ['example' => []])]
    private ?array $additional = null;

    /**
     * @var Collection<int, ComicTitle>
     */
    #[ORM\OneToMany(targetEntity: ComicTitle::class, mappedBy: 'comic')]
    #[Serializer\Groups('comic')]
    #[API\ApiProperty(writable: false)]
    private Collection $titles;

    /**
     * @var Collection<int, ComicCover>
     */
    #[ORM\OneToMany(targetEntity: ComicCover::class, mappedBy: 'comic')]
    #[Serializer\Groups('comic')]
    #[API\ApiProperty(writable: false)]
    private Collection $covers;

    /**
     * @var Collection<int, ComicSynopsis>
     */
    #[ORM\OneToMany(targetEntity: ComicSynopsis::class, mappedBy: 'comic')]
    #[Serializer\Groups('comic')]
    #[API\ApiProperty(writable: false)]
    private Collection $synopses;

    /**
     * @var Collection<int, ComicExternal>
     */
    #[ORM\OneToMany(targetEntity: ComicExternal::class, mappedBy: 'comic')]
    #[Serializer\Groups('comic')]
    #[API\ApiProperty(writable: false)]
    private Collection $externals;

    /**
     * @var Collection<int, ComicCategory>
     */
    #[ORM\OneToMany(targetEntity: ComicCategory::class, mappedBy: 'comic')]
    #[Serializer\Groups('comic')]
    #[API\ApiProperty(writable: false)]
    private Collection $categories;

    public function __construct()
    {
        $this->titles = new ArrayCollection();
        $this->covers = new ArrayCollection();
        $this->synopses = new ArrayCollection();
        $this->externals = new ArrayCollection();
        $this->categories = new ArrayCollection();
    }

    #[ORM\PrePersist]
    public function onPrePersist(PrePersistEventArgs $args)
    {
        $this->setCreatedAt(new \DateTimeImmutable());
        $this->setCode(StringUtil::randomString(8));
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

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): static
    {
        $this->code = $code;

        return $this;
    }

    public function getLanguage(): ?Language
    {
        return $this->language;
    }

    public function getLanguageIETF(): ?string
    {
        if (!$this->language) {
            return null;
        }

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

    public function getPublishedFrom(): ?\DateTimeImmutable
    {
        return $this->publishedFrom;
    }

    public function setPublishedFrom(?\DateTimeImmutable $publishedFrom): static
    {
        $this->publishedFrom = $publishedFrom;

        return $this;
    }

    public function getPublishedTo(): ?\DateTimeImmutable
    {
        return $this->publishedTo;
    }

    public function setPublishedTo(?\DateTimeImmutable $publishedTo): static
    {
        $this->publishedTo = $publishedTo;

        return $this;
    }

    public function getTotalChapter(): ?int
    {
        return $this->totalChapter;
    }

    public function setTotalChapter(?int $totalChapter): static
    {
        $this->totalChapter = $totalChapter;

        return $this;
    }

    public function getTotalVolume(): ?int
    {
        return $this->totalVolume;
    }

    public function setTotalVolume(?int $totalVolume): static
    {
        $this->totalVolume = $totalVolume;

        return $this;
    }

    public function getNsfw(): ?int
    {
        return $this->nsfw;
    }

    public function setNsfw(?int $nsfw): static
    {
        $this->nsfw = $nsfw;

        return $this;
    }

    public function getNsfl(): ?int
    {
        return $this->nsfl;
    }

    public function setNsfl(?int $nsfl): static
    {
        $this->nsfl = $nsfl;

        return $this;
    }

    public function getAdditional(): ?array
    {
        return $this->additional;
    }

    public function setAdditional(?array $additional): static
    {
        $this->additional = $additional;

        return $this;
    }

    /**
     * @return Collection<int, ComicTitle>
     */
    public function getTitles(): Collection
    {
        return $this->titles;
    }

    public function getPreferredTitle(?array $locales = []): ?ComicTitle
    {
        $titles = $this->getTitles()->toArray();

        \usort($titles, function($a, $b) {
            if ($a->getCreatedAt() < $b->getCreatedAt()) return 1;
            if ($a->getCreatedAt() > $b->getCreatedAt()) return -1;

            $al = $a->getLanguageIETF();
            $bl = $b->getLanguageIETF();

            if (\str_starts_with($al, $bl) && !\str_starts_with($bl, $al)) return -1;
            if (!\str_starts_with($al, $bl) && \str_starts_with($bl, $al)) return 1;

            if ($al == $bl) {
                if ($a->isSynonym() && !$b->isSynonym()) return 1;
                if (!$a->isSynonym() && $b->isSynonym()) return -1;

                $nr = preg_match("/^(ja|ko|zh)/", $al);
                if ($a->isRomanized() && !$b->isRomanized()) return $nr ? 1 : -1;
                if (!$a->isRomanized() && $b->isRomanized()) return $nr ? -1 : 1;
            }

            return 0;
        });

        foreach ($locales as $locale) {
            foreach ($titles as $title) {
                if (\str_starts_with($locale, $title->getLanguageIETF())) {
                    return $title;
                }
            }
        }

        return $titles[0] ?? null;
    }

    public function addTitle(ComicTitle $title): static
    {
        if (!$this->titles->contains($title)) {
            $this->titles->add($title);
            $title->setComic($this);
        }

        return $this;
    }

    public function removeTitle(ComicTitle $title): static
    {
        if ($this->titles->removeElement($title)) {
            // set the owning side to null (unless already changed)
            if ($title->getComic() === $this) {
                $title->setComic(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ComicCover>
     */
    public function getCovers(): Collection
    {
        return $this->covers;
    }

    public function getPreferredCover(?string $hint = ''): ?ComicCover
    {
        $covers = $this->getCovers()->toArray();

        \usort($covers, function($a, $b) {
            if ($a->getCreatedAt() < $b->getCreatedAt()) return 1;
            if ($a->getCreatedAt() > $b->getCreatedAt()) return -1;

            $al = $a->getHint() ?? '';
            $bl = $b->getHint() ?? '';
            if (\str_starts_with($al, $bl) && !\str_starts_with($bl, $al)) return -1;
            if (!\str_starts_with($al, $bl) && \str_starts_with($bl, $al)) return 1;

            return 0;
        });

        foreach ($covers as $cover) {
            if (\str_starts_with($hint, $cover->getHint() ?? '')) {
                return $cover;
            }
        }

        return $covers[0] ?? null;
    }

    public function addCover(ComicCover $cover): static
    {
        if (!$this->covers->contains($cover)) {
            $this->covers->add($cover);
            $cover->setComic($this);
        }

        return $this;
    }

    public function removeCover(ComicCover $cover): static
    {
        if ($this->covers->removeElement($cover)) {
            // set the owning side to null (unless already changed)
            if ($cover->getComic() === $this) {
                $cover->setComic(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ComicSynopsis>
     */
    public function getSynopses(): Collection
    {
        return $this->synopses;
    }

    public function getPreferredSynopsis(?array $locales = []): ?ComicSynopsis
    {
        $synopses = $this->getSynopses()->toArray();

        \usort($synopses, function($a, $b) {
            if ($a->getCreatedAt() < $b->getCreatedAt()) return 1;
            if ($a->getCreatedAt() > $b->getCreatedAt()) return -1;

            if ($a->getVersion() && !$b->getVersion()) return 1;
            if (!$a->getVersion() && $b->getVersion()) return -1;

            $al = $a->getLanguageIETF();
            $bl = $b->getLanguageIETF();

            if (\str_starts_with($al, $bl) && !\str_starts_with($bl, $al)) return -1;
            if (!\str_starts_with($al, $bl) && \str_starts_with($bl, $al)) return 1;

            if ($al == $bl) {
                $nr = preg_match("/^(ja|ko|zh)/", $al);
                if ($a->isRomanized() && !$b->isRomanized()) return $nr ? 1 : -1;
                if (!$a->isRomanized() && $b->isRomanized()) return $nr ? -1 : 1;
            }

            return 0;
        });

        foreach ($locales as $locale) {
            foreach ($synopses as $synopsis) {
                if (\str_starts_with($locale, $synopsis->getLanguageIETF())) {
                    return $synopsis;
                }
            }
        }

        return $synopses[0] ?? null;
    }

    public function addSynopsis(ComicSynopsis $synopsis): static
    {
        if (!$this->synopses->contains($synopsis)) {
            $this->synopses->add($synopsis);
            $synopsis->setComic($this);
        }

        return $this;
    }

    public function removeSynopsis(ComicSynopsis $synopsis): static
    {
        if ($this->synopses->removeElement($synopsis)) {
            // set the owning side to null (unless already changed)
            if ($synopsis->getComic() === $this) {
                $synopsis->setComic(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ComicExternal>
     */
    public function getExternals(): Collection
    {
        return $this->externals;
    }

    public function addExternal(ComicExternal $external): static
    {
        if (!$this->externals->contains($external)) {
            $this->externals->add($external);
            $external->setComic($this);
        }

        return $this;
    }

    public function removeExternal(ComicExternal $external): static
    {
        if ($this->externals->removeElement($external)) {
            // set the owning side to null (unless already changed)
            if ($external->getComic() === $this) {
                $external->setComic(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ComicCategory>
     */
    public function getCategories(): Collection
    {
        return $this->categories;
    }

    public function addCategory(ComicCategory $category): static
    {
        if (!$this->categories->contains($category)) {
            $this->categories->add($category);
            $category->setComic($this);
        }

        return $this;
    }

    public function removeCategory(ComicCategory $category): static
    {
        if ($this->categories->removeElement($category)) {
            // set the owning side to null (unless already changed)
            if ($category->getComic() === $this) {
                $category->setComic(null);
            }
        }

        return $this;
    }
}
