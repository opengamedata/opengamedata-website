<?php

class PipelineButton
{
    private $title;
    private $image;
    private $image_active;
    private $file_links;
    private $btn_disabled;
    private $month;
    private $text;
    private $selector;
    private $button_id;
    private $is_active;
    private $is_a_transition_button;

    public function __construct($title, $image, $image_active, $selector, $file_links, $month, $text, $is_active, $is_a_transition_button)
    {
        $this->title = $title;
        $this->image = $image;
        $this->image_active = $image_active;
        $this->file_links = $file_links;
        $this->btn_disabled = count($this->file_links) > 0 ? '' : 'disabled';
        $this->month = $month;
        $this->text = $text;
        $this->selector = $selector;
        $this->button_id = $selector . '-btn';
        $this->is_active = $is_active;
        $this->is_a_transition_button = $is_a_transition_button;
    }

    // Renders a Data Pipeline segment
    public function renderPipelineSegment() {

        if($this->is_a_transition_button)
        {
            return $this->_renderTransitionSegment();
        }

        return $this->_renderPipelineSegment();
        
    }

    protected function _renderPipelineSegment()
    {
        return '<div class="d-flex">
                    <div class="mt-3">
                        <button id="'. $this->button_id . '" class="btn shadow btn-pipeline btn-pipeline-segment position-relative' . ($this->is_active ? ' btn-outline-secondary' : '') . '" type="button"' . $this->btn_disabled . '>
                            <img id="btn-image-' . $this->selector . '" src="assets/images/' . $this->image . '" class="' . (!$this->is_active ? '' : 'd-none') . '" />
                            <img id="btn-image-active-' . $this->selector . '" src="assets/images/' . $this->image_active . '" class="' . ($this->is_active ? '' : 'd-none') . '" />
                            <span>' . htmlspecialchars($this->title) . '</span>
                        </button>
                    </div class="mt-3">
                </div>';
    }

    // Renders a Pipeline transition button
    protected function _renderTransitionSegment() {
        return '<div class="d-flex">
                    <div class="mt-3">
                        <button id="'. $this->button_id . '" class="btn btn-pipeline btn-pipeline-transition position-relative' . ($this->is_active ? ' btn-outline-secondary' : '') . '" type="button"' . $this->btn_disabled . '>
                            <img id="btn-image-' . $this->selector . '" src="assets/images/' . $this->image . '" />
                            <span>' . htmlspecialchars($this->title) . '</span>
                        </button>
                    </div class="mt-3">
                </div>';
    }

    public function renderPipelineTarget()
    {

        $output = '<div class="pipeline-target-block' . ($this->is_active ? '' : ' d-none') . '" id="pipeline-target-' . $this->selector . '">
                    <div class="d-flex">
                        <img src="assets/images/' . $this->image_active . '" class="me-4 mb-3">
                        <div id="pipeline-target-summary">
                            <h3>' . htmlspecialchars($this->title) . '</h3>
                            <p class="pipeline-target-month">Month of ' . htmlspecialchars($this->month) . '</p>
                        </div>
                    </div>
                    <p>' . htmlspecialchars($this->text) . '</p>
                    <div class="btn-group-vertical" id="pipeline-target-links-' . $this->selector . '">';

        foreach($this->file_links as $link_text => $href)
        {
            $output .= '<a class="btn btn-primary mb-2" href="' . htmlspecialchars($href) . '">' . htmlspecialchars($link_text) . '<i class="bi bi-arrow-down"></i></a>';
        }

        $output .='   </div>                    
                    </div>';

        return $output;

    }

}