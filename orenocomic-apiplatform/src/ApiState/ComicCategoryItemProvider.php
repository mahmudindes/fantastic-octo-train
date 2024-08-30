<?php

namespace App\ApiState;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\CategoryKindRepository;
use App\Repository\CategoryRepository;
use App\Repository\ComicCategoryRepository;
use App\Repository\ComicRepository;
use Symfony\Component\DependencyInjection\Attribute as DependencyInjection;

class ComicCategoryItemProvider implements ProviderInterface
{
    public function __construct(
        #[DependencyInjection\Autowire(service: 'api_platform.doctrine.orm.state.item_provider')]
        private ProviderInterface $itemProvider,
        private readonly ComicRepository $comicRepository,
        private readonly ComicCategoryRepository $comicCategoryRepository,
        private readonly CategoryRepository $categoryRepository,
        private readonly CategoryKindRepository $categoryKindRepository
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|null
    {
        return $this->comicCategoryRepository->findOneBy([
            'comic' => $this->comicRepository->findOneBy(['code' => $uriVariables['comicCode']]),
            'category' => $this->categoryRepository->findOneBy([
                'type' => $this->categoryKindRepository->findOneBy(['code' => $uriVariables['typeCode']]),
                'code' => $uriVariables['code']
            ])
        ]);
    }
}
