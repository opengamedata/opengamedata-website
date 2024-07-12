<?php

class Profiler
{
   private $profiler_timing;
   private $profiler_messages;
   private $subprofiler = null;
   private int $indent_level = 0;

   public function __construct($indent_level)
   {
      $this->indent_level = $indent_level;
   }

   // Get methods
   public function getIndent()
   {
      return $this->indent_level;
   }
   public function getSubprofiler()
   {
      return $this->subprofiler;
   }

   public function ResetSubprofiler()
   {
      $this->getSubprofiler()->Complete();
      return $this->subprofiler = new Profiler($this->getIndent() + 1);
   }

   /** Set next "breakpoint" for profiling.
    *  Based on example at https://stackoverflow.com/questions/21133/simplest-way-to-profile-a-php-script
    */
   public function ProfilePoint($msg)
   {
      $this->profiler_timing[] = microtime(true);
      $this->profiler_messages[] = $msg;
   }

   /** Print out all profiling points to a div.
    *  Based on example at https://stackoverflow.com/questions/21133/simplest-way-to-profile-a-php-script
    */
   public function Complete()
   {
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

   private function _printPoint(int $i, $end_time)
   {
      $indentation = $this->getIndent() * 3;
      $timing = $end_time - $this->profiler_timing[$i];
      echo "<span style=\"margin-left:{$indentation}\">";
      echo "<b>{$this->profiler_messages[$i]}</b>";
      echo "&nbsp&nbsp;&nbsp;{$timing}<br>";
      echo "</span>";
   }
}
