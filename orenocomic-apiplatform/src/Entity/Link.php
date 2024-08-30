<?php

namespace App\Entity;

use ApiPlatform\Metadata as API;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\OpenApi\Model as OpenAPI;
use App\Repository\LinkRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\Uid\Ulid;
use Symfony\Component\Serializer\Annotation as Serializer;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: LinkRepository::class)]
#[ORM\Table(name: 'link')]
#[ORM\UniqueConstraint(columns: ['website_id', 'relative_url'])]
#[ORM\HasLifecycleCallbacks]
#[API\ApiResource(
    operations: [
        new API\GetCollection(
            uriTemplate: '/links{._format}',
            order: ['website.domain', 'relativeURL']
        ),
        new API\Post(
            uriTemplate: '/links{._format}'
        ),
        new API\Get(
            uriTemplate: '/links/{ulid}{._format}'
        ),
        new API\Put(
            uriTemplate: '/links/{ulid}{._format}'
        ),
        new API\Delete(
            uriTemplate: '/links/{ulid}{._format}'
        ),
        new API\Patch(
            uriTemplate: '/links/{ulid}{._format}'
        )
    ],
    normalizationContext: ['groups' => ['link']],
    denormalizationContext: ['groups' => ['link']],
    openapi: new OpenAPI\Operation(tags: ['Link'])
)]
class Link
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: Types::BIGINT)]
    #[API\ApiProperty(identifier: false)]
    private ?int $id = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE)]
    #[Serializer\Groups('link')]
    #[API\ApiProperty(writable: false)]
    #[API\ApiFilter(OrderFilter::class)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: true)]
    #[Serializer\Groups('link')]
    #[API\ApiProperty(writable: false)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(type: 'ulid', unique: true)]
    #[Serializer\Groups('link')]
    #[API\ApiProperty(identifier: true, writable: false)]
    #[API\ApiFilter(OrderFilter::class)]
    private ?Ulid $ulid = null;

    #[ORM\ManyToOne(inversedBy: 'links')]
    #[ORM\JoinColumn(name:'website_id', nullable: false, onDelete: 'CASCADE')]
    #[Serializer\Groups('link')]
    #[API\ApiProperty(openapiContext: ['example' => 'string'])]
    #[API\ApiFilter(OrderFilter::class, properties: ['website.domain'])]
    private ?Website $website = null;

    #[Assert\NotBlank(allowNull: true)]
    #[Serializer\Groups('link')]
    private ?string $websiteDomain = null;

    #[ORM\Column(name:'relative_url', length: 128, nullable: true)]
    #[Assert\NotBlank(allowNull: true), Assert\Length(min: 1, max:128)]
    #[Assert\Regex('/^\//')]
    #[Serializer\Groups('link')]
    #[API\ApiProperty(openapiContext: ['example' => '/'])]
    #[API\ApiFilter(OrderFilter::class)]
    private ?string $relativeURL = null;

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

        if ($this->websiteDomain) {
            $websiteRepository = $entityManager->getRepository(Website::class);
            $this->setWebsite($websiteRepository->findOneBy(['domain' => $this->websiteDomain]));
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

    public function getUlid(): ?Ulid
    {
        return $this->ulid;
    }

    public function setUlid(Ulid $ulid): static
    {
        $this->ulid = $ulid;

        return $this;
    }

    public function getWebsite(): ?Website
    {
        return $this->website;
    }

    public function getWebsiteDomain(): ?string
    {
        return $this->website->getDomain();
    }

    public function setWebsite(?Website $website): static
    {
        $this->website = $website;

        return $this;
    }

    public function setWebsiteDomain(?string $websiteDomain): static
    {
        $this->websiteDomain = $websiteDomain;

        return $this;
    }

    public function getRelativeURL(): ?string
    {
        return $this->relativeURL;
    }

    public function setRelativeURL(?string $relativeURL): static
    {
        $this->relativeURL = $relativeURL;

        return $this;
    }
}
