<?php

namespace App\ApiState;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Component\DependencyInjection\Attribute as DependencyInjection;

class ComicSubresourceInputProcessor implements ProcessorInterface
{
    public function __construct(
        #[DependencyInjection\Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor
    )
    {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (isset($uriVariables['comicCode'])) {
            $data->setComicCode($uriVariables['comicCode']);
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);;
    }
}
