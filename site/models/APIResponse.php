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
        $type   = isset($obj->{'type'})   ? $obj->{'type'}             : null;
        $val    = isset($obj->{'val'})    ? json_decode($obj->{'val'}) : null;
        $msg    = isset($obj->{'msg'})    ? $obj->{'msg'}              : null;
        $status = isset($obj->{'status'}) ? $obj->{'status'}           : null;
        return new static($type, $val, $msg, $status);
    }

    public static function fromJson($json) {
        $obj = json_decode($json);
        $type   = isset($obj->{'type'})   ? $obj->{'type'}             : null;
        $val    = isset($obj->{'val'})    ? json_decode($obj->{'val'}) : null;
        $msg    = isset($obj->{'msg'})    ? $obj->{'msg'}              : null;
        $status = isset($obj->{'status'}) ? $obj->{'status'}           : null;
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
