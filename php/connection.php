<?php
function connection(){
      $hostname="127.0.0.1";
	  $username="root";
	  $passwd="root";
	  $link=mysql_pconnect($hostname,$username,$passwd)
	  or die ("Could not connect to database!"."</hr>".mysql_error());
	  
	  mysql_query("set names utf8");
	  return $link;
}

function squery($database,$sql,$link){
      $database=mysql_select_db($database,$link)
	  or die ("Could not select the database!"."</hr>".mysql_error($link));
	  
	  $result=mysql_query($sql,$link);
	  return $result;
}

?>
