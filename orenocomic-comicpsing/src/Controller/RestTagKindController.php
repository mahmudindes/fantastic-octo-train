<?php

namespace App\Controller;

use App\Entity\TagKind;
use App\Form\TagKindType;
use App\Repository\TagKindRepository;
use App\Util\QueryParameter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\UnicodeString;

#[Route("/api/rest/v0/tag-types", name: 'rest_tagtype_')]
class RestTagKindController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly TagKindRepository $tagKindRepository
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

        if ($sort) \array_unshift($orderBys, 'code sort=' . $sort);

        $result = $this->tagKindRepository->findByCustom($criteria, $orderBys, $limit, $offset);
        $totalCount = $this->tagKindRepository->countCustom($criteria);

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
        $entity = new TagKind();

        $form = $this->createForm(TagKindType::class, $entity, ['csrf_protection' => false]);
        switch ($request->headers->get('Content-Type')) {
            case 'application/json':
                $form->submit(\json_decode($request->getContent(), true));
                break;
            default:
                $form->submit($request->getPayload()->all());
        }
        if (!$form->isValid()) {
            return $this->json(['message' => 'Tag Type data is not valid.'], Response::HTTP_BAD_REQUEST);
        }

        $entity = $form->getData();

        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        $slug = $request->getPathInfo() . '/' . $entity->getCode();
        return $this->json($entity, Response::HTTP_CREATED, ['Location' => $slug]);
    }

    #[Route('/{code}', name: 'get_by_code', methods: [Request::METHOD_GET])]
    public function getByCode(
        string $code
    ): Response
    {
        $result = $this->tagKindRepository->findOneBy(['code' => $code]);
        if (!$result) {
            return $this->json(['message' => 'Tag Type does not exists.'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($result);
    }

    #[Route('/{code}', name: 'patch_by_code', methods: [Request::METHOD_PATCH])]
    public function patchByCode(
        Request $request, string $code
    ): Response
    {
        $entity = $this->tagKindRepository->findOneBy(['code' => $code]);
        if (!$entity) {
            return $this->json(['message' => 'Tag Type does not exists.'], Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm(TagKindType::class, $entity, ['csrf_protection' => false]);
        switch ($request->headers->get('Content-Type')) {
            case 'application/json':
                $form->submit(\json_decode($request->getContent(), true), false);
                break;
            default:
                $form->submit($request->getPayload()->all(), false);
        }
        if (!$form->isValid()) {
            return $this->json(['message' => 'Tag Type data is not valid.'], Response::HTTP_BAD_REQUEST);
        }

        $entity = $form->getData();

        $this->entityManager->flush();

        $slug = (new UnicodeString($request->getPathInfo()))->trimSuffix($code) . $entity->getCode();
        return $this->json($entity, Response::HTTP_OK, ['Location' => $slug]);
    }

    #[Route('/{code}', name: 'delete_by_code', methods: [Request::METHOD_DELETE])]
    public function deleteByCode(
        string $code
    ): Response
    {
        $entity = $this->tagKindRepository->findOneBy(['code' => $code]);
        if (!$entity) {
            return $this->json(['message' => 'Tag Type does not exists.'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($entity);
        $this->entityManager->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}
