<?php

namespace App\Controller;

use App\Entity\Language;
use App\Form\LanguageType;
use App\Repository\LanguageRepository;
use App\Util\QueryParameter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\UnicodeString;

#[Route('/api/rest/v0/languages', name: 'rest_language_')]
class RestLanguageController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly LanguageRepository $languageRepository
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

        if ($sort) \array_unshift($orderBys, 'ietf sort=' . $sort);

        $result = $this->languageRepository->findByCustom($criteria, $orderBys, $limit, $offset);
        $totalCount = $this->languageRepository->countCustom($criteria);

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
        $entity = new Language();

        $form = $this->createForm(LanguageType::class, $entity, ['csrf_protection' => false]);
        switch ($request->headers->get('Content-Type')) {
            case 'application/json':
                $form->submit(\json_decode($request->getContent(), true));
                break;
            default:
                $form->submit($request->getPayload()->all());
        }
        if (!$form->isValid()) {
            return $this->json(['message' => 'Language data is not valid.'], Response::HTTP_BAD_REQUEST);
        }

        $entity = $form->getData();

        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        $slug = $request->getPathInfo() . '/' . $entity->getIetf();
        return $this->json($entity, Response::HTTP_CREATED, ['Location' => $slug]);
    }

    #[Route('/{ietf}', name: 'get_by_ietf', methods: [Request::METHOD_GET])]
    public function getByIetf(
        string $ietf
    ): Response
    {
        $result = $this->languageRepository->findOneBy(['ietf' => $ietf]);
        if (!$result) {
            return $this->json(['message' => 'Language does not exists.'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($result);
    }

    #[Route('/{ietf}', name: 'patch_by_ietf', methods: [Request::METHOD_PATCH])]
    public function patchByIetf(
        Request $request, string $ietf
    ): Response
    {
        $entity = $this->languageRepository->findOneBy(['ietf' => $ietf]);
        if (!$entity) {
            return $this->json(['message' => 'Language does not exists.'], Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm(LanguageType::class, $entity, ['csrf_protection' => false]);
        switch ($request->headers->get('Content-Type')) {
            case 'application/json':
                $form->submit(\json_decode($request->getContent(), true), false);
                break;
            default:
                $form->submit($request->getPayload()->all(), false);
        }
        if (!$form->isValid()) {
            return $this->json(['message' => 'Language data is not valid.'], Response::HTTP_BAD_REQUEST);
        }

        $entity = $form->getData();

        $this->entityManager->flush();

        $slug = (new UnicodeString($request->getPathInfo()))->trimSuffix($ietf) . $entity->getIetf();
        return $this->json($entity, Response::HTTP_OK, ['Location' => $slug]);
    }

    #[Route('/{ietf}', name: 'delete_by_ietf', methods: [Request::METHOD_DELETE])]
    public function deleteByIetf(
        string $ietf
    ): Response
    {
        $entity = $this->languageRepository->findOneBy(['ietf' => $ietf]);
        if (!$entity) {
            return $this->json(['message' => 'Language does not exists.'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($entity);
        $this->entityManager->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}
