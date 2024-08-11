<?php

namespace App\Form;

use App\Entity\ComicTitle;
use App\Entity\Language;
use App\Form\DataTransformer\LanguageTransformer;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ComicTitleType extends AbstractType
{
    public function __construct(
        private readonly LanguageTransformer $languageTransformer
    )
    {
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('language', EntityType::class, [
                'class' => Language::class,
                'choice_label' => 'name',
            ])
            ->add(
                $builder
                    ->create('languageIETF', HiddenType::class, [
                        'property_path' => 'language'
                    ])
                    ->addModelTransformer($this->languageTransformer)
            )
            ->add('title')
            ->add('synonym')
            ->add('romanized')
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ComicTitle::class,
        ]);
    }
}
