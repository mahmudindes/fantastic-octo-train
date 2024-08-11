<?php

namespace App\Form\DataTransformer;

use App\Entity\Language;
use App\Repository\LanguageRepository;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;

class LanguageTransformer implements DataTransformerInterface
{
    public function __construct(
        private readonly LanguageRepository $languageRepository
    )
    {
    }

    public function transform($language): string
    {
        return $language !== null ? $language->getIetf() : '';
    }

    public function reverseTransform($languageIetf): ?Language
    {
        if (!$languageIetf) return null;

        return $this->languageRepository->findOneBy(['ietf' => $languageIetf]);
    }
}
