<?php

namespace App\Entity;

use App\Repository\ComicVolumeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ComicVolumeRepository::class)]
#[ORM\Table(name: 'comic_volume')]
#[ORM\UniqueConstraint(columns: ['comic_id', 'volume'])]
class ComicVolume
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: Types::BIGINT)]
    private ?int $id = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'volumes')]
    #[ORM\JoinColumn(name:'comic_id', nullable: false, onDelete: 'CASCADE')]
    private ?Comic $comic = null;

    #[ORM\Column(length: 64)]
    private ?string $volume = null;

    #[ORM\Column(name: 'released_at', type: Types::DATETIMETZ_IMMUTABLE)]
    private ?\DateTimeImmutable $releasedAt = null;

    /**
     * @var Collection<int, ComicChapter>
     */
    #[ORM\OneToMany(targetEntity: ComicChapter::class, mappedBy: 'volume')]
    private Collection $chapters;

    public function __construct()
    {
        $this->chapters = new ArrayCollection();
    }

    public function getID(): ?int
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

    public function setComic(?Comic $comic): static
    {
        $this->comic = $comic;

        return $this;
    }

    public function getVolume(): ?string
    {
        return $this->volume;
    }

    public function setVolume(string $volume): static
    {
        $this->volume = $volume;

        return $this;
    }

    public function getReleasedAt(): ?\DateTimeImmutable
    {
        return $this->releasedAt;
    }

    public function setReleasedAt(\DateTimeImmutable $releasedAt): static
    {
        $this->releasedAt = $releasedAt;

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
            $chapter->setVolume($this);
        }

        return $this;
    }

    public function removeChapter(ComicChapter $chapter): static
    {
        if ($this->chapters->removeElement($chapter)) {
            // set the owning side to null (unless already changed)
            if ($chapter->getVolume() === $this) {
                $chapter->setVolume(null);
            }
        }

        return $this;
    }
}
