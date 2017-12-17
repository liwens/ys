<?php
$require=$_REQUEST["require"];
if($require=="require_comment"){
	$aid=$_REQUEST["aid"];
	require_once ("connection.php");
	$link=connection();
	$sql="select 
		  avatar as 'comment_user_avatar',
		  username as 'comment_username',
		  comment.time as'comment_time',
		  floor as 'comment_floor',
		  comment.content as 'comment_content',
		  comment.likeNum as 'comment_lick_num',
		  cid as'comment_id',
		  article.aid as 'comment_aid' 
		  from 
		  user,comment,article 
		  where 
		  article.aid=".$aid."
		  and
		  article.aid=comment.aid 
		  and 
		  user.uid=comment.uid 
		  order by comment.time desc";
	$orderMessage=squery("helping",$sql,$link);
	
	// $array=mysql_fetch_assoc($orderMessage);
	// echo $array["comment_user_avatar"];echo $array["comment_useranme"];echo $array["comment_time"];echo $array["comment_floor"];echo $array["comment_content"];echo $array["comment_lick_num"];echo $array["comment_id"];echo $array["comment_aid"];
	
	$arrayJson = array();
		if($orderMessage){
		while($array=mysql_fetch_assoc($orderMessage)){
			$arrays=array(
				"comment_user_avatar" => $array["comment_user_avatar"],
				"comment_username" => $array["comment_username"],
				"comment_time" => $array["comment_time"],
				"comment_floor" => $array["comment_floor"],
				"comment_content" => $array["comment_content"],
				"comment_lick_num" => $array["comment_lick_num"],
				"comment_id" => $array["comment_id"],
				"comment_aid" => $array["comment_aid"]);
			array_push($arrayJson,$arrays);
		}

		echo '{"success":"true","lists":'.json_encode($arrayJson).'}';
	

	}else{

		echo '{"success":"false","lists":'.mysql_error().'}';//返回错误信息 

	}
}else{

		echo '{"success":"false","lists":'.mysql_error().'}';//返回错误信息 

	}

?>