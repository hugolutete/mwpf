<?php

namespace App\Form;

use App\Dto\PasswordUpdateDto;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UpdatePasswordType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('password', TextType::class, [
                'required' => true,
                'label' => false,
                'attr' => [
                    'placeholder' => 'New Password',
                    'class' => 'form_input',
                ],
            ])
            ->add('cellphone', TextType::class, [
                'required' => true,
                'label' => false,
                // https://github.com/odolbeau/phone-number-bundle
                'attr' => [
                    'placeholder' => 'Phone Number',
                    'class' => 'form_input',
                ],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // Configure your form options here
            'data_class' => PasswordUpdateDto::class,
        ]);
    }
}