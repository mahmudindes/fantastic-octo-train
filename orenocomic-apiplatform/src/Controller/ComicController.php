<?php

namespace App\Controller;

use App\Repository\ComicRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute as HttpKernel;
use Symfony\Component\Routing\Attribute as Routing;

#[Routing\Route('/comics', name: 'app_comic_')]
class ComicController extends AbstractController
{
    public function __construct(
        private readonly ComicRepository $comicRepository
    )
    {
    }

    #[Routing\Route('/', name: 'index')]
    public function index(
        #[HttpKernel\MapQueryParameter(options: ['min_range' => 1])] int $page = 1
    ): Response
    {
        $limit = 10;

        $comicCount = $this->comicRepository->count([]);

        return $this->render('comic/index.html.twig', [
            'paramPage' => $page,
            'paramLimit' => $limit,
            'resultComicCount' => $comicCount
        ]);
    }

    #[Routing\Route('/{code}', name: 'individual')]
    public function individual(
        string $code
    ): Response
    {
        $comic = $this->comicRepository->findOneBy(['code' => $code]);

        return $this->render('comic/individual.html.twig', [
            'paramCode' => $code,
            'resultComic' => $comic
        ]);
    }

    public function fragmentList(
        string $order, int $limit, int $page
    ): Response
    {
        $orderBy = [$order => 'ASC'];
        $offset = $limit * ($page - 1);

        $comics = $this->comicRepository->findBy([], $orderBy, $limit, $offset);

        return $this->render('comic/_list.html.twig', [
            'paramOrder' => $order,
            'paramLimit' => $limit,
            'paramPage' => $page,
            'resultComics' => $comics
        ]);
    }

    public function fragmentWidget(
        string $order
    ): Response
    {
        $orderBy = [$order => 'ASC'];

        $comics = $this->comicRepository->findBy([], $orderBy, 5, null);

        return $this->render('comic/_widget.html.twig', [
            'resultComics' => $comics
        ]);
    }
}
