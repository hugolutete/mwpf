<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

final class PagesController extends AbstractController
{
    #[Route('/about.html', name: 'app_about', methods: ['GET'])]
    public function about(): Response
    {
        return $this->render('pages/about.html.twig');
    }

    #[Route('/annuity.html', name: 'app_annuity', methods: ['GET'])]
    public function annuity(): Response
    {
        return $this->render('pages/annuity.html.twig');
    }

    #[Route('/yourbenefits.html', name: 'app_benefits', methods: ['GET'])]
    public function benefits(): Response
    {
        return $this->render('pages/benefits.html.twig');
    }

    #[Route('/death.html', name: 'app_death', methods: ['GET'])]
    public function death(): Response
    {
        return $this->render('pages/death.html.twig');
    }

    #[Route('/disability.html', name: 'app_disability', methods: ['GET'])]
    public function disability(): Response
    {
        return $this->render('pages/disability.html.twig', [
            'controller_name' => 'DisabilityController',
        ]);
    }

    #[Route('/employers.html', name: 'app_employers', methods: ['GET'])]
    public function employers(): Response
    {
        return $this->render('pages/employers.html.twig');
    }

    #[Route('/funeral.html', name: 'app_funeral', methods: ['GET'])]
    public function funeral(): Response
    {
        return $this->render('pages/funeral.html.twig', [
            'controller_name' => 'FuneralController',
        ]);
    }
    #[Route('/housing.html', name: 'app_housing', methods: ['GET'])]
    public function housing(): Response
    {
        return $this->render('pages/housing.html.twig', [
            'controller_name' => 'HousingController',
        ]);
    }
    #[Route('/masibambisane.html', name: 'app_masibambisane', methods: ['GET'])]
    public function masibambisane(): Response
    {
        return $this->render('pages/masibambisane.html.twig', [
            'controller_name' => 'MasibambisaneController',
        ]);
    }

    #[Route('/products.html', name: 'app_products', methods: ['GET'])]
    public function products(): Response
    {
        return $this->render('pages/products.html.twig');
    }


    #[Route('/retirement.html', name: 'app_retirement', methods: ['GET'])]
    public function retirement(): Response
    {
        return $this->render('pages/retirement.html.twig');
    }

    #[Route('/retrenchment.html', name: 'app_retrenchment', methods: ['GET'])]
    public function retrenchment(): Response
    {
        return $this->render('pages/retrenchment.html.twig');
    }

    #[Route('/team.html', name: 'app_team', methods: ['GET'])]
    public function team(): Response
    {
        return $this->render('pages/team.html.twig');
    }

    #[Route('/videos.html', name: 'app_videos', methods: ['GET'])]
    public function videos(): Response
    {
        return $this->render('pages/videos.html.twig');
    }

    #[Route('/success.html', name: 'app_success', methods: ['GET'])]
    public function success(): Response
    {
        return $this->render('pages/success.html.twig');
    }
}