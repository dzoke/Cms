<?php

namespace Opifer\ContentBundle\Block\Service;

use Opifer\ContentBundle\Block\Tool\ContentTool;
use Opifer\ContentBundle\Block\Tool\ToolsetMemberInterface;
use Opifer\ContentBundle\Entity\JumbotronBlock;
use Opifer\ContentBundle\Model\BlockInterface;
use Opifer\MediaBundle\Form\Type\MediaPickerType;
use Symfony\Component\Form\FormBuilderInterface;

/**
 * Class JumbotronBlockService
 *
 * @package Opifer\ContentBundle\Block
 */
class JumbotronBlockService extends AbstractBlockService implements BlockServiceInterface, ToolsetMemberInterface
{
    /**
     * {@inheritdoc}
     */
    public function buildManageForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildManageForm($builder, $options);

        $propertiesForm = $builder->create('properties', 'form')
            ->add('id', 'text', ['attr' => ['help_text' => 'help.html_id']])
            ->add('extra_classes', 'text', ['attr' => ['help_text' => 'help.extra_classes']]);


        if ($this->config['styles']) {

            $propertiesForm
                ->add('styles', 'choice', [
                    'label' => 'label.styling',
                    'choices'  => $this->config['styles'],
                    'required' => false,
                    'expanded' => true,
                    'multiple' => true,
                    'attr' => ['help_text' => 'help.html_styles'],
                ]);
        }

        $builder->add(
            $builder->create('default', 'form', ['inherit_data' => true])
                ->add('media', MediaPickerType::class, [
                    'required'  => false,
                    'multiple' => false,
                    'attr' => array('label_col' => 12, 'widget_col' => 12),
                ])
                ->add('value', 'ckeditor', ['label' => 'label.rich_text', 'attr' => ['label_col' => 12, 'widget_col' => 12]])
        )->add(
            $propertiesForm
        );
    }

    /**
     * {@inheritDoc}
     */
    public function createBlock()
    {
        return new JumbotronBlock;
    }

    /**
     * @return array
     */
    public function getStyles()
    {
        return $this->config['styles'];
    }

    /**
     * {@inheritDoc}
     */
    public function getTool()
    {
        $tool = new ContentTool('Jumbotron', 'OpiferContentBundle:JumbotronBlock');

        $tool->setIcon('settings_overscan')
            ->setDescription('Large piece of content with bigger font and optional background image.');

        return $tool;
    }
}
