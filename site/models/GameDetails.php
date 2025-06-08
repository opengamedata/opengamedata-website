<?php
require_once 'Publication.php';
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
        
        return GameDetails::fromArray($id, $data);
    }

    public static function fromArray($id, $data) {
        // build the array for publications
        $publications = array();
        foreach ($data->{'studies'} as $value) {
            array_push($publications, Publication::fromObj($value));
        }

        return new static($id, $data->{'game_name'}, $data->{'game_description'}, $data->{'thumbnail_path'}, $data->{'play_link'}, $data->{'source_link'}, $data->{'developers'}[0]->{'name'}, $data->{'developers'}[0]->{'link'}, $publications);
    }

    // Get methods
    public function getId(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->game_id) : $this->game_id;
    }
    public function getName(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->game_name) : $this->game_name;
    }
    public function getDescription(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->game_description) : $this->game_description;
    }
    public function getPlayLink(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->play_link) : $this->play_link;
    }
    public function getSourceLink(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->source_link) : $this->source_link;
    }
    public function getThumbPath(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->thumbnail_path) : $this->thumbnail_path;
    }
    public function getDeveloperName(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->developer_name) : $this->developer_name;
    }
    public function getDeveloperLink(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->developer_link) : $this->developer_link;
    }
    public function getPublications()
    {
        return $this->publications;
    }

    public function getDeveloperIconFilename(bool $html_safe = true) : ?string
    {
        $path = null;
        switch($this->developer_name)
        {
            case 'PBS Wisconsin':
                $path = 'pbs/pbs-64.png';
            break;

            case 'MIT Education Arcade':
                $path = 'mit/mit-64.png';
            break;

            case 'Field Day Lab':
            default:
                $path = 'fieldday/fieldday-64.png';
            break;

        }
        return $html_safe ? htmlspecialchars($path) : $path;
    }

    // Set methods
    public function setId(string $id)
    {
        $this->game_id = $id;
    }
    public function setName(string $name)
    {
        return $this->game_name = $name;
    }
    public function setDescription(string $description)
    {
        return $this->game_description = $description;
    }
    public function setPlayLink(string $link)
    {
        return $this->play_link = $link;
    }
    public function setSourceLink(string $link)
    {
        return $this->source_link = $link;
    }
    public function setThumbPath(string $path)
    {
        return $this->thumbnail_path = $path;
    }
    public function setDeveloperName(string $name)
    {
        return $this->developer_name = $name;
    }
    public function setDeveloperLink(string $link)
    {
        return $this->developer_link = $link;
    }

}
