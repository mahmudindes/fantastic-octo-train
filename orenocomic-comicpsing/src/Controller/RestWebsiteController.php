<?php

namespace App\Controller;

use App\Entity\Website;
use App\Form\WebsiteType;
use App\Repository\WebsiteRepository;
use App\Util\QueryParameter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\UnicodeString;

#[Route("/api/rest/v0/websites", name: 'rest_website_')]
class RestWebsiteController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly WebsiteRepository $websiteRepository
    )
    {
    }

    #[Route('', name: 'list', methods: [Request::METHOD_GET])]
    public function list(
        Request $request,
        #[MapQueryParameter(options: ['min_range' => 1])] int $page = 1,
        #[MapQueryParameter(options: ['min_range' => 1, 'max_range' => 30])] int $limit = 10,
        #[MapQueryParameter] string $sort = null
    ): Response
    {
        $queries = new QueryParameter($request->server);

        $criteria = [];
        $orderBys = $queries->all('order_by');
        $offset = $limit * ($page - 1);

        if ($sort) \array_unshift($orderBys, 'domain sort=' . $sort);

        $result = $this->websiteRepository->findByCustom($criteria, $orderBys, $limit, $offset);
        $totalCount = $this->websiteRepository->countCustom($criteria);

        return $this->json($result, Response::HTTP_OK, [
            'X-Total-Count' => $totalCount,
            'X-Pagination-Limit' => $limit,
        ]);
    }

    #[Route('', name: 'post', methods: [Request::METHOD_POST])]
    public function post(
        Request $request
    ): Response
    {
        $entity = new Website();

        $form = $this->createForm(WebsiteType::class, $entity, ['csrf_protection' => false]);
        switch ($request->headers->get('Content-Type')) {
            case 'application/json':
                $form->submit(\json_decode($request->getContent(), true));
                break;
            default:
                $form->submit($request->getPayload()->all());
        }
        if (!$form->isValid()) {
            return $this->json(['message' => 'Website data is not valid.'], Response::HTTP_BAD_REQUEST);
        }

        $entity = $form->getData();

        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        $slug = $request->getPathInfo() . '/' . $entity->getDomain();
        return $this->json($entity, Response::HTTP_CREATED, ['Location' => $slug]);
    }

    #[Route('/{domain}', name: 'get_by_domain', methods: [Request::METHOD_GET])]
    public function getByDomain(
        string $domain
    ): Response
    {
        $result = $this->websiteRepository->findOneBy(['domain' => $domain]);
        if (!$result) {
            return $this->json(['message' => 'Website does not exists.'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($result);
    }

    #[Route('/{domain}', name: 'patch_by_domain', methods: [Request::METHOD_PATCH])]
    public function patchByDomain(
        Request $request, string $domain
    ): Response
    {
        $entity = $this->websiteRepository->findOneBy(['domain' => $domain]);
        if (!$entity) {
            return $this->json(['message' => 'Website does not exists.'], Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm(WebsiteType::class, $entity, ['csrf_protection' => false]);
        switch ($request->headers->get('Content-Type')) {
            case 'application/json':
                $form->submit(\json_decode($request->getContent(), true), false);
                break;
            default:
                $form->submit($request->getPayload()->all(), false);
        }
        if (!$form->isValid()) {
            return $this->json(['message' => 'Website data is not valid.'], Response::HTTP_BAD_REQUEST);
        }

        $entity = $form->getData();

        $this->entityManager->flush();

        $slug = (new UnicodeString($request->getPathInfo()))->trimSuffix($domain) . $entity->getDomain();
        return $this->json($entity, Response::HTTP_OK, ['Location' => $slug]);
    }

    #[Route('/{domain}', name: 'delete_by_domain', methods: [Request::METHOD_DELETE])]
    public function deleteByDomain(
        string $domain
    ): Response
    {
        $entity = $this->websiteRepository->findOneBy(['domain' => $domain]);
        if (!$entity) {
            return $this->json(['message' => 'Website does not exists.'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($entity);
        $this->entityManager->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}
