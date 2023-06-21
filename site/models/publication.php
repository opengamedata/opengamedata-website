<?php
class Publication 
{
    protected $authors;
    protected $paper_link;
    protected $name;
    protected $year;
    protected $project_code_link;

    public function __construct($name=null, $paper_link=null, $authors=null, $year=null, $project_code_link=null) 
    {
        $this->name = $name;
        $this->paper_link = $paper_link;
        $this->authors = $authors;
        $this->year = $year;
        $this->project_code_link = $project_code_link;
    }

    public static function fromObj($obj) 
    {
        return new static($obj->{'name'}, $obj->{'paper_link'}, implode(', ', $obj->{'authors'}), $obj->{'year'}, $obj->{'project_code_link'});
    }

    public function getAuthors()
    {
        return $this->authors;
    }
    public function getName()
    {
        return $this->name;
    }
    public function getPaperLink()
    {
        return $this->paper_link;
    }
    public function getYear()
    {
        return $this->year;
    }
    public function getProjectCodeLink()
    {
        return $this->project_code_link;
    }
    public function getFormattedPublication()
    {
        $paperLink = htmlspecialchars($this->paper_link);
        $projectLink = htmlspecialchars($this->project_code_link);
        $pubName = htmlspecialchars($this->name);
        $pubYear = htmlspecialchars($this->year);
        $pubAuthors = htmlspecialchars($this->authors);
        $formatted = '';
        if (!empty($this->authors)) $formatted.= "{$pubAuthors}. ";
        if (!empty($this->year)) $formatted.= "({$pubYear}). ";
        $formatted.= !empty($this->paper_link) ? "<a href=\"{$paperLink}\" target=\"_blank\">{$pubName}.</a> " : "{$pubName}. "; 
        if (!empty($this->project_code_link)) $formatted.= "<br><a class=\"btn btn-outline-secondary btn-publication mt-3\" href=\"{$projectLink}\" target=\"_blank\">View Project Code</a>";
        return $formatted;
    }
}