<?php

namespace App\Form\DataTransformer;

use App\Entity\Link;
use App\Repository\LinkRepository;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;

class LinkTransformer implements DataTransformerInterface
{
    public function __construct(
        private readonly LinkRepository $linkRepository
    )
    {
    }

    public function transform($link): string
    {
        return $link !== null ? $link->getUlid() : '';
    }

    public function reverseTransform($linkULID): ?Website
    {
        if (!$linkULID) return null;

        return $this->linkRepository->findOneBy(['ulid' => $linkULID]);
    }
}
