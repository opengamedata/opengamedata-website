<?php
class APIResponse
{
    protected $_type;
    protected $_value;
    protected $_message;
    protected $_status;

    public function __construct($type, $val, $msg, $status)
    {
        $this->_type = $type;
        $this->_value = $val;
        $this->_message = $msg;
        $this->_status = $status;
    }

    public static function fromObj($obj) {
        $type   = $obj->{'type'}             ? isset($obj->{'type'})   : null;
        $val    = json_decode($obj->{'val'}) ? isset($obj->{'val'})    : null;
        $msg    = $obj->{'msg'}              ? isset($obj->{'msg'})    : null;
        $status = $obj->{'status'}           ? isset($obj->{'status'}) : null;
        return new static($type, $val, $msg, $status);
    }

    public static function fromJson($json) {
        $obj = json_decode($json);
        $type   = $obj->{'type'}             ? isset($obj->{'type'})   : null;
        $val    = json_decode($obj->{'val'}) ? isset($obj->{'val'})    : null;
        $msg    = $obj->{'msg'}              ? isset($obj->{'msg'})    : null;
        $status = $obj->{'status'}           ? isset($obj->{'status'}) : null;
        return new static($type, $val, $msg, $status);
    }

    // Get methods
    public function Type()
    {
        return $this->_type;
    }
    public function Value()
    {
        return $this->_value;
    }
    public function Message()
    {
        return $this->_message;
    }
    public function Status()
    {
        return $this->_status;
    }
}
