<?php

namespace App\EventListener;

use ApiPlatform\State\Pagination\PaginatorInterface;
use Symfony\Component\EventDispatcher\Attribute as EventDispatcher;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\KernelEvents;

final class ApiPlatformListener
{
    #[EventDispatcher\AsEventListener(event: KernelEvents::RESPONSE)]
    public function onKernelResponse(ResponseEvent $event): void
    {
        if (HttpKernelInterface::MAIN_REQUEST !== $event->getRequestType()) {
            return;
        }

        $request = $event->getRequest();

        $data = $request->attributes->get('data');

        if (!$data instanceof PaginatorInterface) {
            return;
        }

        $response = $event->getResponse();

        switch (\explode(';', $response->headers->get('Content-Type'))[0]) {
            case 'application/json':
                $response->headers->set('X-Total-Count', $data->getTotalItems());
                break;
        }
    }
}
