<?php

namespace App\Entity;

use App\Repository\ComicRepository;
use App\Util\StringUtil;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation as Serializer;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ComicRepository::class)]
#[ORM\Table(name: 'comic')]
#[ORM\HasLifecycleCallbacks]
class Comic
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: Types::BIGINT)]
    private ?int $id = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[Assert\Length(8)]
    #[ORM\Column(length: 8, unique: true)]
    private ?string $code = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name:'language_id')]
    #[Serializer\Ignore]
    private ?Language $language = null;

    #[ORM\Column(name: 'published_from', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $publishedFrom = null;

    #[ORM\Column(name: 'published_to', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $publishedTo = null;

    #[ORM\Column(nullable: true)]
    #[Assert\Positive]
    private ?int $totalChapter = null;

    #[ORM\Column(nullable: true)]
    #[Assert\Positive]
    private ?int $totalVolume = null;

    #[Assert\Range(min: -1, max: 1)]
    #[ORM\Column(type: Types::SMALLINT, nullable: true)]
    private ?int $nsfw = null;

    #[Assert\Range(min: -1, max: 1)]
    #[ORM\Column(type: Types::SMALLINT, nullable: true)]
    private ?int $nsfl = null;

    #[ORM\Column(nullable: true)]
    private ?array $additional = null;

    /**
     * @var Collection<int, ComicTitle>
     */
    #[ORM\OneToMany(targetEntity: ComicTitle::class, mappedBy: 'comic')]
    private Collection $titles;

    /**
     * @var Collection<int, ComicCover>
     */
    #[ORM\OneToMany(targetEntity: ComicCover::class, mappedBy: 'comic')]
    private Collection $covers;

    /**
     * @var Collection<int, ComicSynopsis>
     */
    #[ORM\OneToMany(targetEntity: ComicSynopsis::class, mappedBy: 'comic')]
    private Collection $synopses;

    /**
     * @var Collection<int, ComicExternal>
     */
    #[ORM\OneToMany(targetEntity: ComicExternal::class, mappedBy: 'comic')]
    private Collection $externals;

    /**
     * @var Collection<int, Category>
     */
    #[ORM\ManyToMany(targetEntity: Category::class)]
    #[ORM\JoinTable(name: 'comic_category')]
    private Collection $categories;

    /**
     * @var Collection<int, Tag>
     */
    #[ORM\ManyToMany(targetEntity: Tag::class)]
    #[ORM\JoinTable(name: 'comic_tag')]
    private Collection $tags;

    /**
     * @var Collection<int, ComicRelation>
     */
    #[ORM\OneToMany(targetEntity: ComicRelation::class, mappedBy: 'parent')]
    private Collection $relations;

    /**
     * @var Collection<int, ComicChapter>
     */
    #[ORM\OneToMany(targetEntity: ComicChapter::class, mappedBy: 'comic')]
    private Collection $chapters;

    /**
     * @var Collection<int, ComicVolume>
     */
    #[ORM\OneToMany(targetEntity: ComicVolume::class, mappedBy: 'comic')]
    private Collection $volumes;

    public function __construct()
    {
        $this->titles = new ArrayCollection();
        $this->covers = new ArrayCollection();
        $this->synopses = new ArrayCollection();
        $this->externals = new ArrayCollection();
        $this->categories = new ArrayCollection();
        $this->tags = new ArrayCollection();
        $this->relations = new ArrayCollection();
        $this->chapters = new ArrayCollection();
        $this->volumes = new ArrayCollection();
    }

    #[ORM\PrePersist]
    public function onPrePersist()
    {
        $this->setCreatedAt(new \DateTimeImmutable());
        $this->setCode(StringUtil::randomString(8));
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

    public function setLanguage(?Language $language): static
    {
        $this->language = $language;

        return $this;
    }

    public function getLanguageIETF(): ?string
    {
        if (\is_null($this->language)) {
            return null;
        }

        return $this->language->getIetf();
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
     * @return Collection<int, Category>
     */
    public function getCategories(): Collection
    {
        return $this->categories;
    }

    public function addCategory(Category $category): static
    {
        if (!$this->categories->contains($category)) {
            $this->categories->add($category);
        }

        return $this;
    }

    public function removeCategory(Category $category): static
    {
        $this->categories->removeElement($category);

        return $this;
    }

    /**
     * @return Collection<int, Tag>
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }

    public function addTag(Tag $tag): static
    {
        if (!$this->tags->contains($tag)) {
            $this->tags->add($tag);
        }

        return $this;
    }

    public function removeTag(Tag $tag): static
    {
        $this->tags->removeElement($tag);

        return $this;
    }

    /**
     * @return Collection<int, ComicRelation>
     */
    public function getRelations(): Collection
    {
        return $this->relations;
    }

    public function addRelation(ComicRelation $relation): static
    {
        if (!$this->relations->contains($relation)) {
            $this->relations->add($relation);
            $relation->setParent($this);
        }

        return $this;
    }

    public function removeRelation(ComicRelation $relation): static
    {
        if ($this->relations->removeElement($relation)) {
            // set the owning side to null (unless already changed)
            if ($relation->getParent() === $this) {
                $relation->setParent(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ComicChapter>
     */
    public function getChapters(): Collection
    {
        return $this->chapters;
    }

    public function addChapter(ComicChapter $chapter): static
    {
        if (!$this->chapters->contains($chapter)) {
            $this->chapters->add($chapter);
            $chapter->setComic($this);
        }

        return $this;
    }

    public function removeChapter(ComicChapter $chapter): static
    {
        if ($this->chapters->removeElement($chapter)) {
            // set the owning side to null (unless already changed)
            if ($chapter->getComic() === $this) {
                $chapter->setComic(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ComicVolume>
     */
    public function getVolumes(): Collection
    {
        return $this->volumes;
    }

    public function addVolume(ComicVolume $volume): static
    {
        if (!$this->volumes->contains($volume)) {
            $this->volumes->add($volume);
            $volume->setComic($this);
        }

        return $this;
    }

    public function removeVolume(ComicVolume $volume): static
    {
        if ($this->volumes->removeElement($volume)) {
            // set the owning side to null (unless already changed)
            if ($volume->getComic() === $this) {
                $volume->setComic(null);
            }
        }

        return $this;
    }
}
