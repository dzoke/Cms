<?php

namespace Opifer\ContentBundle\Block\Service;

use Opifer\ContentBundle\Block\Tool\Tool;
use Opifer\ContentBundle\Block\Tool\ToolsetMemberInterface;
use Opifer\ContentBundle\Entity\IFrameBlock;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

/**
 * iFrame Block Service
 */
class IFrameBlockService extends AbstractBlockService implements BlockServiceInterface, ToolsetMemberInterface
{
    /**
     * {@inheritdoc}
     */
    public function buildManageForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildManageForm($builder, $options);

        $propertiesForm = $builder->create('properties', FormType::class);

        $builder->add(
            $propertiesForm
                ->add('url', TextType::class, ['attr' => ['help_text' => 'help.iframe_url']])
                ->add('width', TextType::class, ['attr' => []])
                ->add('height', TextType::class, ['attr' => []])
        )->add(
            $propertiesForm->add('id', TextType::class, ['attr' => ['help_text' => 'help.html_id']])
                ->add('extra_classes', TextType::class, ['attr' => ['help_text' => 'help.extra_classes']])

        );

        if ($this->config['styles']) {
            $propertiesForm->add('styles', ChoiceType::class, [
                'label' => 'label.styling',
                'choices' => $this->config['styles'],
                'required' => false,
                'expanded' => true,
                'multiple' => true,
                'attr' => ['help_text' => 'help.html_styles'],
            ]);
        }
    }

    /**
     * {@inheritDoc}
     */
    public function createBlock()
    {
        return new IFrameBlock;
    }

    /**
     * {@inheritDoc}
     */
    public function getTool()
    {
        $tool = new Tool('iFrame', 'OpiferContentBundle:IFrameBlock');

        $tool->setIcon('web_asset')
            ->setDescription('Include a iframe with url of choice');

        return $tool;
    }
}
