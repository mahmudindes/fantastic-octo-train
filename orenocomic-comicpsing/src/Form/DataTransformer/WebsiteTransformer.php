<?php

namespace App\Form\DataTransformer;

use App\Entity\Website;
use App\Repository\WebsiteRepository;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;

class WebsiteTransformer implements DataTransformerInterface
{
    public function __construct(
        private readonly WebsiteRepository $websiteRepository
    )
    {
    }

    public function transform($website): string
    {
        return $website !== null ? $website->getDomain() : '';
    }

    public function reverseTransform($websiteDomain): ?Website
    {
        if (!$websiteDomain) return null;

        return $this->websiteRepository->findOneBy(['domain' => $websiteDomain]);
    }
}
