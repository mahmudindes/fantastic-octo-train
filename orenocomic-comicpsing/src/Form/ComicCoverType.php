<?php

namespace App\Form;

use App\Entity\ComicCover;
use App\Entity\Link;
use App\Form\DataTransformer\LinkTransformer;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ComicCoverType extends AbstractType
{
    public function __construct(
        private readonly LinkTransformer $linkTransformer
    )
    {
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('hint')
            ->add('link', EntityType::class, [
                'class' => Link::class,
                'choice_label' => function (Link $link): string {
                    return $link->getWebsiteDomain() . $link->getRelativeURL();
                },
            ])
            ->add(
                $builder
                    ->create('linkULID', HiddenType::class, [
                        'property_path' => 'link'
                    ])
                    ->addModelTransformer($this->linkTransformer)
            )
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ComicCover::class,
        ]);
    }
}
