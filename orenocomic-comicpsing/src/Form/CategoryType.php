<?php

namespace App\Form;

use App\Entity\Category;
use App\Entity\CategoryKind;
use App\Form\DataTransformer\CategoryTransformer;
use App\Form\DataTransformer\CategoryKindTransformer;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Event\PreSubmitEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CategoryType extends AbstractType
{
    public function __construct(
        private readonly CategoryTransformer $categoryTransformer,
        private readonly CategoryKindTransformer $categoryKindTransformer
    )
    {
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('type', EntityType::class, [
                'class' => CategoryKind::class,
                'choice_label' => 'name',
            ])
            ->add(
                $builder
                    ->create('typeCode', HiddenType::class, [
                        'property_path' => 'type'
                    ])
                    ->addModelTransformer($this->categoryKindTransformer)
            )
            ->add('code')
            ->add('name')
            ->add('parent', EntityType::class, [
                'class' => Category::class,
                'choice_label' => 'name',
            ])
            ->add(
                $builder
                    ->create('parentCode', HiddenType::class, [
                        'mapped' => false,
                    ])
            )
            ->add(
                $builder
                    ->create('parentTypeCodeCode', HiddenType::class, [
                        'property_path' => 'parent'
                    ])
                    ->addModelTransformer($this->categoryTransformer)
            )
            ->addEventListener(FormEvents::PRE_SUBMIT, function(PreSubmitEvent $event): void {
                $data = $event->getData();

                if (!$data) return;

                if (isset($data['parentCode'])) {
                    $data0 = $data['typeCode'];
                    if (isset($data['type'])) $data0 = $data['type']->getCode();

                    $data['parentTypeCodeCode'] = $data0 . ':' . $data['parentCode'];
                    $event->setData($data);
                }
            })
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Category::class,
        ]);
    }
}
