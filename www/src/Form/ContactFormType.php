<?php

namespace App\Form;

use App\Dto\ContactFormDto;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

final class ContactFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', null, [
                'required' => true,
                'label' => 'Name:',
                'attr' => [
                    'class' => 'form_input',
                ],
            ])
            ->add('email', EmailType::class, [
                'required' => true,
                'label' => 'Email:',
                'attr' => [
                    'class' => 'form_input',
                ],
            ])
            ->add('message', TextareaType::class, [
                'required' => true,
                'label' => 'Message:',
                'attr' => [
                    'class' => 'form_textarea',
                ],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // Configure your form options here
            'data_class' => ContactFormDto::class,
        ]);
    }
}
