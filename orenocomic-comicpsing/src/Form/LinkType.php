<?php

namespace App\Form;

use App\Entity\Link;
use App\Entity\Website;
use App\Form\DataTransformer\WebsiteTransformer;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class LinkType extends AbstractType
{
    public function __construct(
        private readonly WebsiteTransformer $websiteTransformer
    )
    {
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('website', EntityType::class, [
                'class' => Website::class,
                'choice_label' => 'name',
            ])
            ->add(
                $builder
                    ->create('websiteDomain', HiddenType::class, [
                        'property_path' => 'website'
                    ])
                    ->addModelTransformer($this->websiteTransformer)
            )
            ->add('relativeURL')
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Link::class,
        ]);
    }
}
