<?php

namespace App\Controller;

use App\Entity\Link;
use App\Form\LinkType;
use App\Repository\LinkRepository;
use App\Util\QueryParameter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\UnicodeString;

#[Route("/api/rest/v0/links", name: 'rest_link_')]
class RestLinkController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly LinkRepository $linkRepository
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

        if ($sort) \array_unshift($orderBys, 'ulid sort=' . $sort);

        $result = $this->linkRepository->findByCustom($criteria, $orderBys, $limit, $offset);
        $totalCount = $this->linkRepository->countCustom($criteria);

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
        $entity = new Link();

        $form = $this->createForm(LinkType::class, $entity, ['csrf_protection' => false]);
        switch ($request->headers->get('Content-Type')) {
            case 'application/json':
                $form->submit(\json_decode($request->getContent(), true));
                break;
            default:
                $form->submit($request->getPayload()->all());
        }
        if (!$form->isValid()) {
            return $this->json(['message' => 'Link data is not valid.'], Response::HTTP_BAD_REQUEST);
        }

        $entity = $form->getData();

        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        $slug = $request->getPathInfo() . '/' . $entity->getUlid();
        return $this->json($entity, Response::HTTP_CREATED, ['Location' => $slug]);
    }

    #[Route('/{ulid}', name: 'get_by_ulid', methods: [Request::METHOD_GET])]
    public function getByUlid(
        string $ulid
    ): Response
    {
        $result = $this->linkRepository->findOneBy(['ulid' => $ulid]);
        if (!$result) {
            return $this->json(['message' => 'Link does not exists.'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($result);
    }

    #[Route('/{ulid}', name: 'patch_by_ulid', methods: [Request::METHOD_PATCH])]
    public function patchByUlid(
        Request $request, string $ulid
    ): Response
    {
        $entity = $this->linkRepository->findOneBy(['ulid' => $ulid]);
        if (!$entity) {
            return $this->json(['message' => 'Link does not exists.'], Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm(LinkType::class, $entity, ['csrf_protection' => false]);
        switch ($request->headers->get('Content-Type')) {
            case 'application/json':
                $form->submit(\json_decode($request->getContent(), true), false);
                break;
            default:
                $form->submit($request->getPayload()->all(), false);
        }
        if (!$form->isValid()) {
            return $this->json(['message' => 'Link data is not valid.'], Response::HTTP_BAD_REQUEST);
        }

        $entity = $form->getData();

        $this->entityManager->flush();

        $slug = (new UnicodeString($request->getPathInfo()))->trimSuffix($ulid) . $entity->getUlid();
        return $this->json($entity, Response::HTTP_OK, ['Location' => $slug]);
    }

    #[Route('/{ulid}', name: 'delete_by_ulid', methods: [Request::METHOD_DELETE])]
    public function deleteByUlid(
        string $ulid
    ): Response
    {
        $entity = $this->linkRepository->findOneBy(['ulid' => $ulid]);
        if (!$entity) {
            return $this->json(['message' => 'Link does not exists.'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($entity);
        $this->entityManager->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}
