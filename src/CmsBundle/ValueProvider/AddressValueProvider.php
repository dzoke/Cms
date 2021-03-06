<?php

namespace Opifer\CmsBundle\ValueProvider;

use Opifer\EavBundle\ValueProvider\AbstractValueProvider;
use Opifer\EavBundle\ValueProvider\ValueProviderInterface;
use Symfony\Component\Form\FormBuilderInterface;

/**
 * Address Value Provider.
 *
 * @author Rick van Laarhoven <r.vanlaarhoven@opifer.nl>
 */
class AddressValueProvider extends AbstractValueProvider implements ValueProviderInterface
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('address', 'google_address', [
            'label' => $options['attribute']->getDisplayName(),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function getEntity()
    {
        return 'Opifer\CmsBundle\Entity\AddressValue';
    }
}
