<?php

class PipelineButton
{
    private $title;
    private $image;
    private $css;
    private $file_links;
    private $btn_disabled;
    private $month;
    private $text;
    private $button_id;
    private $month_id;
    private $anchor_id;
    private $header;
    private $body;
    private $header_id;
    private $body_id;
    private $close_id;

    public function __construct($title, $image, $css, $selector, $file_links, $month, $text)
    {
        $this->title = $title;
        $this->image = $image;
        $this->css = $css;
        $this->file_links = $file_links;
        $this->month = $month;
        $this->text = $text;
        $this->btn_disabled = count($this->file_links) > 0 ? '' : 'disabled';
        $this->button_id = $selector . '-btn';
        $this->month_id = $selector . '-month';
        $this->anchor_id = $selector . '-link';
        $this->header_id = $selector . '-header';
        $this->body_id = $selector . '-body';
        $this->close_id = $selector . '-close';
        $this->header = "$this->title <small id='$this->month_id'>Month of $this->month</small> <img class='pipeline-pop' src='/assets/images/$this->image' alt=''> <button id='$this->close_id' type='button' class='btn-close' aria-label='Close'></button>";
        $this->body = "<p>$this->text</p>";
        // Loop through file_links array and add download links
        $index = 0;
        foreach($this->file_links as $key => $value) {
            $classList = $value ? 'btn btn-primary mb-2' : 'd-none';
            $this->body .= "<a id='$this->anchor_id-$index' class='$classList' href='$value'>$key <i class='bi bi-arrow-down'></i></a>";
            $index++;
        }        
    }

    // Renders the Pipeline button with popover content
    public function renderButton() {
        return '<button id="'. $this->button_id . '" class="btn ' . $this->css . ' position-relative" type="button"' . $this->btn_disabled . ' 
                    data-bs-toggle="popover" data-bs-placement="right"
                    data-bs-html="true"
                    data-bs-custom-class="pipeline-popover shadow"
                    data-bs-title="' . $this->header . '" 
                    data-bs-content="' . $this->body . '">
                </button>';
    }

    // Renders hidden elements used to update popover content on month change
    // Needed because popover elements are removed from DOM when not open
    public function renderElements() {
        return '<div class="d-none">
                    <div id="' . $this->header_id . '">' . $this->header . '</div>
                    <div id="' . $this->body_id . '">' . $this->body . '</div>
                </div>';
    }
}