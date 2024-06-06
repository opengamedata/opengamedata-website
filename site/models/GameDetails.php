<?php
require_once 'publication.php';
class GameDetails
{
    protected $game_id;
    protected $game_name;
    protected $game_description;
    protected $thumbnail_path;    
    protected $play_link;
    protected $source_link;
    protected $developer_name;
    protected $developer_link;
    protected $publications;

    public function __construct($id, $name, $description, $thumbnail_path, $play_link, $source_link, $developer_name, $developer_link, $publications)
    {
        $this->game_id = $id;
        $this->game_name = $name;
        $this->game_description = $description;
        $this->thumbnail_path = $thumbnail_path;
        $this->play_link = $play_link;
        $this->source_link = $source_link;
        $this->developer_name = $developer_name;
        $this->developer_link = $developer_link;
        $this->publications = $publications;
    }

    public static function fromJson($id, $json) {
        // game object returned from api
        $data = json_decode($json);
        
        // build the array for publications
        $publications = array();
        foreach ($data->{'studies'} as $value) {
            array_push($publications, Publication::fromObj($value));
        }

        return new static($id, $data->{'game_name'}, $data->{'game_description'}, $data->{'thumbnail_path'}, $data->{'play_link'}, $data->{'source_link'}, $data->{'developers'}[0]->{'name'}, $data->{'developers'}[0]->{'link'}, $publications);
    }

    // Get methods
    public function getId()
    {
        return $this->game_id;
    }
    public function getName()
    {
        return $this->game_name;
    }
    public function getDescription()
    {
        return $this->game_description;
    }
    public function getPlayLink()
    {
        return $this->play_link;
    }
    public function getSourceLink()
    {
        return $this->source_link;
    }
    public function getThumbPath()
    {
        return $this->thumbnail_path;
    }
    public function getDeveloperName()
    {
        return $this->developer_name;
    }
    public function getDeveloperLink()
    {
        return $this->developer_link;
    }
    public function getPublications()
    {
        return $this->publications;
    }

    public function getDeveloperIconFilename()
    {
        switch($this->developer_name)
        {
            case 'PBS Wisconsin':
                return 'avatar-pbs-wi.png';
            break;

            case 'MIT Education Arcade':
                return 'avatar-mit.png';
            break;

            case 'Field Day Lab':
            default:
                return 'avatar.png';
            break;

        }
    }

    // Set methods
    public function setId($id)
    {
        $this->game_id = $id;
    }
    public function setName($name)
    {
        return $this->game_name = $name;
    }
    public function setDescription($description)
    {
        return $this->game_description = $description;
    }
    public function setPlayLink($link)
    {
        return $this->play_link = $link;
    }
    public function setSourceLink($link)
    {
        return $this->source_link = $link;
    }
    public function setThumbPath($path)
    {
        return $this->thumbnail_path = $path;
    }
    public function setDeveloperName($name)
    {
        return $this->developer_name = $name;
    }
    public function setDeveloperLink($link)
    {
        return $this->developer_link = $link;
    }

}
