<?php

namespace App\Form;

use App\Entity\Category;
use App\Entity\Comic;
use App\Entity\Language;
use App\Entity\Tag;
use App\Form\DataTransformer\LanguageTransformer;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ComicType extends AbstractType
{
    public function __construct(
        private readonly LanguageTransformer $languageTransformer
    )
    {
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('code')
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
            ->add('publishedFrom', null, [
                'widget' => 'single_text',
            ])
            ->add('publishedTo', null, [
                'widget' => 'single_text',
            ])
            ->add('totalChapter')
            ->add('totalVolume')
            ->add('nsfw')
            ->add('nsfl')
            ->add('additional')
            ->add('categories', EntityType::class, [
                'class' => Category::class,
                'choice_label' => 'name',
                'multiple' => true,
            ])
            ->add('tags', EntityType::class, [
                'class' => Tag::class,
                'choice_label' => 'name',
                'multiple' => true,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Comic::class,
        ]);
    }
}
