<?php

namespace App\Controller;

use App\Entity\ComicTitle;
use App\Form\ComicTitleType;
use App\Repository\ComicRepository;
use App\Repository\ComicTitleRepository;
use App\Util\QueryParameter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\UnicodeString;

#[Route('/api/rest/v0/comics/{code}/titles', name: 'rest_comic_title_')]
class RestComicTitleController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ComicRepository $comicRepository,
        private readonly ComicTitleRepository $comicTitleRepository
    )
    {
    }

    #[Route('', name: 'list', methods: [Request::METHOD_GET])]
    public function list(
        Request $request, string $code,
        #[MapQueryParameter(options: ['min_range' => 1])] int $page = 1,
        #[MapQueryParameter(options: ['min_range' => 1, 'max_range' => 15])] int $limit = 10,
        #[MapQueryParameter] string $sort = null
    ): Response
    {
        $queries = new QueryParameter($request->server);

        $criteria = ['comicCodes' => [$code]];
        $orderBys = $queries->all('order_by');
        $offset = $limit * ($page - 1);

        if ($sort) \array_unshift($orderBys, 'ulid sort=' . $sort);

        $result = $this->comicTitleRepository->findByCustom($criteria, $orderBys, $limit, $offset);
        $totalCount = $this->comicTitleRepository->countCustom($criteria);

        return $this->json($result, Response::HTTP_OK, [
            'X-Total-Count' => $totalCount,
            'X-Pagination-Limit' => $limit,
        ]);
    }

    #[Route('', name: 'post', methods: [Request::METHOD_POST])]
    public function post(
        Request $request, string $code
    ): Response
    {
        $entity = new ComicTitle();

        $form = $this->createForm(ComicTitleType::class, $entity, ['csrf_protection' => false]);
        switch ($request->headers->get('Content-Type')) {
            case 'application/json':
                $form->submit(\json_decode($request->getContent(), true));
                break;
            default:
                $form->submit($request->getPayload()->all());
        }
        if (!$form->isValid()) {
            return $this->json(['message' => 'Comic Title data is not valid.'], Response::HTTP_BAD_REQUEST);
        }

        $entity = $form->getData();
        $entity->setComic($this->comicRepository->findOneBy(['code' => $code]));

        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        $slug = $request->getPathInfo() . '/' . $entity->getUlid();
        return $this->json($entity, Response::HTTP_CREATED, ['Location' => $slug]);
    }

    #[Route('/{ulid}', name: 'get_by_ulid', methods: [Request::METHOD_GET])]
    public function getByUlid(
        string $code, string $ulid
    ): Response
    {
        $result = $this->comicTitleRepository->findOneBy([
            'comic' => $this->comicRepository->findOneBy(['code' => $code]),
            'ulid' => $ulid
        ]);
        if (!$result) {
            return $this->json(['message' => 'Comic does not exists.'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($result);
    }

    #[Route('/{ulid}', name: 'patch_by_ulid', methods: [Request::METHOD_PATCH])]
    public function patchByUlid(
        Request $request, string $code, string $ulid
    ): Response
    {
        $entity = $this->comicTitleRepository->findOneBy([
            'comic' => $this->comicRepository->findOneBy(['code' => $code]),
            'ulid' => $ulid
        ]);
        if (!$entity) {
            return $this->json(['message' => 'Comic Title does not exists.'], Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm(ComicTitleType::class, $entity, ['csrf_protection' => false]);
        switch ($request->headers->get('Content-Type')) {
            case 'application/json':
                $form->submit(\json_decode($request->getContent(), true), false);
                break;
            default:
                $form->submit($request->getPayload()->all(), false);
        }
        if (!$form->isValid()) {
            return $this->json(['message' => 'Comic Title data is not valid.'], Response::HTTP_BAD_REQUEST);
        }

        $entity = $form->getData();

        $this->entityManager->flush();

        $slug = (new UnicodeString($request->getPathInfo()))->trimSuffix($ulid) . $entity->getUlid();
        return $this->json($entity, Response::HTTP_OK, ['Location' => $slug]);
    }

    #[Route('/{ulid}', name: 'delete_by_ulid', methods: [Request::METHOD_DELETE])]
    public function deleteByUlid(
        string $code, string $ulid
    ): Response
    {
        $entity = $this->comicTitleRepository->findOneBy([
            'comic' => $this->comicRepository->findOneBy(['code' => $code]),
            'ulid' => $ulid
        ]);
        if (!$entity) {
            return $this->json(['message' => 'Comic Title does not exists.'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($entity);
        $this->entityManager->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}
