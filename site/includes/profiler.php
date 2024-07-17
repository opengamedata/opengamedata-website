<?php

require_once 'includes/app_config.php';

class Profiler
{
   private string $instance_id;
   private int $indent_level;
   private int $prec;
   private $profiler_timing;
   private $profiler_messages;

   public function __construct($id, $indent_level=0, $precision=2)
   {
      $this->instance_id = $id;
      $this->indent_level = $indent_level;
      $this->prec = $precision;
      $this->profiler_timing   = [];
      $this->profiler_messages = [];
   }

   /** Set next "breakpoint" for profiling.
    *  Based on example at https://stackoverflow.com/questions/21133/simplest-way-to-profile-a-php-script
    */
   public function ProfilePoint($msg)
   {
      if (\AppConfig::GetConfig()['DEBUG_ENV'])
      {
         error_log("{$this->indent_level}: Profiling {$msg}.");
         $this->profiler_timing[] = microtime(true);
         $this->profiler_messages[] = $msg;
      }
   }

   /** Print out all profiling points to a div.
    *  Based on example at https://stackoverflow.com/questions/21133/simplest-way-to-profile-a-php-script
    */
   public function Complete()
   {
      if (\AppConfig::GetConfig()['DEBUG_ENV'])
      {
         error_log("{$this->indent_level}: Completing.");
         $final_timing = microtime(true);
         $count = count($this->profiler_timing);
         if ($count > 0)
         {
            echo "<div>";
            for ($i = 0; $i < $count - 1; $i++)
            {
               $this->_printPoint($i, $this->profiler_timing[$i+1]);
            }
            $this->_printPoint($count-1, $final_timing);
            echo "</div>";
         }
      }
   }

   private function _printPoint(int $i, $end_time)
   {
      $indentation = $this->indent_level * 3;
      $timing = number_format($end_time - $this->profiler_timing[$i], $this->prec);
      echo "<span style=\"margin-left:{$indentation} em\">";
      echo "<b>{$this->profiler_messages[$i]}</b>";
      echo "&nbsp&nbsp;&nbsp;{$timing}<br>";
      echo "</span>";
   }
}
