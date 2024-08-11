<?php

namespace App\Entity;

use App\Repository\ComicRelationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ComicRelationRepository::class)]
#[ORM\Table(name: 'comic_relation')]
class ComicRelation
{
    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name:'type_id', nullable: false)]
    private ?ComicRelationType $type = null;

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'relations')]
    #[ORM\JoinColumn(name:'parent_id', nullable: false, onDelete: 'CASCADE')]
    private ?Comic $parent = null;

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name:'child_id', nullable: false, onDelete: 'CASCADE')]
    private ?Comic $child = null;

    public function getType(): ?ComicRelationType
    {
        return $this->type;
    }

    public function setType(?ComicRelationType $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getParent(): ?Comic
    {
        return $this->parent;
    }

    public function setParent(?Comic $parent): static
    {
        $this->parent = $parent;

        return $this;
    }

    public function getChild(): ?Comic
    {
        return $this->child;
    }

    public function setChild(?Comic $child): static
    {
        $this->child = $child;

        return $this;
    }
}
