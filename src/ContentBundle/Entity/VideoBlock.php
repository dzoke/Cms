<?php

namespace Opifer\ContentBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Opifer\ContentBundle\Entity\Block;
use Opifer\MediaBundle\Model\MediaInterface;

/**
 * VideoBlock
 *
 * @ORM\Entity
 */
class VideoBlock extends Block
{
    /**
     * @var string
     *
     * @Gedmo\Versioned
     * @ORM\Column(type="string", name="title", nullable=true)
     */
    protected $title;

    /**
     * @var string
     *
     * @Gedmo\Versioned
     * @ORM\Column(type="string", name="caption", nullable=true)
     */
    protected $caption;

    /**
     * @var integer
     *
     * @Gedmo\Versioned
     * @ORM\Column(type="integer", name="width", nullable=true)
     */
    protected $width;

    /**
     * @var integer
     *
     * @Gedmo\Versioned
     * @ORM\Column(type="integer", name="height", nullable=true)
     */
    protected $height;

    /**
     * @var MediaInterface
     *
     * @Gedmo\Versioned
     * @ORM\ManyToOne(targetEntity="Opifer\MediaBundle\Model\MediaInterface", fetch="EAGER")
     * @ORM\JoinColumn(name="media_id", referencedColumnName="id", onDelete="SET NULL")
     */
    protected $media;

    /**
     * @return MediaInterface
     */
    public function getMedia()
    {
        return $this->media;
    }

    /**
     * @param MediaInterface $media
     *
     * @return $this
     */
    public function setMedia($media)
    {
        $this->media = $media;

        return $this;
    }



    /**
     * @return string
     */
    public function getBlockType()
    {
        return 'video';
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param string $title
     *
     * @return VideoBlock
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return string
     */
    public function getCaption()
    {
        return $this->caption;
    }

    /**
     * @param string $caption
     *
     * @return VideoBlock
     */
    public function setCaption($caption)
    {
        $this->caption = $caption;

        return $this;
    }

    /**
     * @return string
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * @param string $width
     *
     * @return VideoBlock
     */
    public function setWidth($width)
    {
        $this->width = $width;

        return $this;
    }


    /**
     * @return string
     */
    public function getHeight()
    {
        return $this->height;
    }

    /**
     * @param string $height
     *
     * @return VideoBlock
     */
    public function setHeight($height)
    {
        $this->height = $height;

        return $this;
    }

}
