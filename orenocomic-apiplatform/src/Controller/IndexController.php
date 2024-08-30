<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute as Routing;

#[Routing\Route('', name: 'app_')]
class IndexController extends AbstractController
{
    #[Routing\Route('/', name: 'index')]
    public function index(): Response
    {
        return $this->render('index/index.html.twig', []);
    }
}
