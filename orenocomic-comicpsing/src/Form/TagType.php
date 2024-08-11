<?php

namespace App\Form;

use App\Entity\Tag;
use App\Entity\TagKind;
use App\Form\DataTransformer\TagKindTransformer;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TagType extends AbstractType
{
    public function __construct(
        private readonly TagKindTransformer $tagKindTransformer
    )
    {
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('type', EntityType::class, [
                'class' => TagKind::class,
                'choice_label' => 'id',
            ])
            ->add(
                $builder
                    ->create('typeCode', HiddenType::class, [
                        'property_path' => 'type'
                    ])
                    ->addModelTransformer($this->tagKindTransformer)
            )
            ->add('code')
            ->add('name')
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Tag::class,
        ]);
    }
}
