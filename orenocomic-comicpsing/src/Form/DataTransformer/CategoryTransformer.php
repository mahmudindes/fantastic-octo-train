<?php

namespace App\Form\DataTransformer;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use App\Repository\CategoryKindRepository;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;

class CategoryTransformer implements DataTransformerInterface
{
    public function __construct(
        private readonly CategoryRepository $categoryRepository,
        private readonly CategoryKindRepository $categoryKindRepository
    )
    {
    }

    public function transform($category): string
    {
        return $category !== null ? $category->getType()->getCode() . ':' . $category->getCode() : '';
    }

    public function reverseTransform($categoryTypeCodeCode): ?Category
    {
        if (!$categoryTypeCodeCode) return null;

        $val = \explode(':', $categoryTypeCodeCode, 2);
        return $this->categoryRepository->findOneBy([
            'type' => $this->categoryKindRepository->findOneBy(['code' => $val[0]]),
            'code' => $val[1],
        ]);
    }
}
