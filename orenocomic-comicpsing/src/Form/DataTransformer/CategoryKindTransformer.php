<?php

namespace App\Form\DataTransformer;

use App\Entity\CategoryKind;
use App\Repository\CategoryKindRepository;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;

class CategoryKindTransformer implements DataTransformerInterface
{
    public function __construct(
        private readonly CategoryKindRepository $categoryKindRepository
    )
    {
    }

    public function transform($categoryKind): string
    {
        return $categoryKind !== null ? $categoryKind->getCode() : '';
    }

    public function reverseTransform($categoryKindCode): ?CategoryKind
    {
        if (!$categoryKindCode) return null;

        return $this->categoryKindRepository->findOneBy(['code' => $categoryKindCode]);
    }
}
