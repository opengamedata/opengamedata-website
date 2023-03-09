<?php
class Game
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

    public function __construct(string $id, string $name, string $description, string $thumbnail_path, string $play_link, string $source_link, string $developer_name, string $developer_link, array $publications)
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

    public static function fromJson(string $id, string $json): static {
        
        // get game object from full game_list
        //$data = json_decode($json)->{$id};
        
        // game object returned from api
        $data = json_decode($json);
        
        // build the array for publications
        $publications = array();
        foreach ($data->{'studies'} as $value) {
            array_push($publications, (object) ["StudyName" => $value->{'name'} , "Link" => $value->{'link'}]);
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


?>