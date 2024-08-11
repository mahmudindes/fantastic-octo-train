<?php

namespace App\Form\DataTransformer;

use App\Entity\TagKind;
use App\Repository\TagKindRepository;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;

class TagKindTransformer implements DataTransformerInterface
{
    public function __construct(
        private readonly TagKindRepository $tagKindRepository
    )
    {
    }

    public function transform($tagKind): string
    {
        return $tagKind !== null ? $tagKind->getCode() : '';
    }

    public function reverseTransform($tagKindCode): ?TagKind
    {
        if (!$tagKindCode) return null;

        return $this->tagKindRepository->findOneBy(['code' => $tagKindCode]);
    }
}
