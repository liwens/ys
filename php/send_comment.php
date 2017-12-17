<?php
function echoMessage($content){
	$numArry=mysql_fetch_assoc($content);
	if(is_array($numArry)){
		foreach ($numArry as $result){ 
      					return $result;
    				} 
    		}
}

$require=$_REQUEST["require"];
$aid=$_REQUEST["aid"];
$operUid=$_REQUEST["uid"];
$username=$_REQUEST["username"];
$content=$_REQUEST["content"];

$time=date("Y-m-d H:i:s");
$likeNum=0;

require_once ("connection.php");
$link=connection();

$floor_sql="select max(floor) from comment where aid=".$aid."";
$floor_s=squery("helping",$floor_sql,$link);	
$floor_r=echoMessage($floor_s);

$floor=$floor_r+1;

$sql="insert into comment (aid,uid,content,time,floor,likeNum) values (".$aid.",".$operUid.",'".$content."','".$time."',".$floor.",".$likeNum.")";

$result=squery("helping",$sql,$link);		

	if($result!=false){
		$sql_s="select 
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
			  comment.aid=".$aid."
			  and
			  article.aid=comment.aid 
			  and 
			  comment.uid=".$operUid."
			  and
			  user.uid=comment.uid
			  order by comment.time desc";
		$orderMessage=squery("helping",$sql_s,$link);
		
		$jsonArray = array();
		if($orderMessage){

			/***************将评论信息写入remind表****************/
			$remind_uid_sql="select uid from article where aid=".$aid."";
			$remind_uid_s=squery("helping",$remind_uid_sql,$link);
			$uid=echoMessage($remind_uid_s);
			$type=0;
			$readed=1;
			$time=date("Y-m-d H:i:s");

			$remind_input_sql=" insert into remind (uid,aid,type,readed,time,operUid) values('".$uid."','".$aid."','".$type."','".$readed."','".$time."','".$operUid."')";
			$remind_input_result=squery("helping",$remind_input_sql,$link);
			/***************将评论信息写入remind表****************/
		if($remind_input_result){
			$array=mysql_fetch_assoc($orderMessage);
			$arrays=array(
				"comment_user_avatar" => $array["comment_user_avatar"],
				"comment_username" => $array["comment_username"],
				"comment_time" => $array["comment_time"],
				"comment_floor" => $array["comment_floor"],
				"comment_content" => $array["comment_content"],
				"comment_lick_num" => $array["comment_lick_num"],
				"comment_id" => $array["comment_id"],
				"comment_aid" => $array["comment_aid"]);
			array_push($jsonArray,$arrays);
		
			
			echo '{"success":"true","lists":'.json_encode($jsonArray).'}';
		}else{
			echo '{"success":"false","lists":'.mysql_error().'}';
		}
	

	}else{

		echo '{"success":"false","lists":'.mysql_error().'}';//返回错误信息 

	}
	}else {
		echo '{"success":"false","lists":'.mysql_error().'}';
	}

?>