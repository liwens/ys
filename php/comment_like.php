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

if($require=='comment_like'){
	$cid=$_REQUEST['comment_id'];

	require_once ("connection.php");
	$link=connection();

	$like_sql="select likeNum from comment where cid=".$cid."";
	$like_s=squery("helping",$like_sql,$link);	
	$like=echoMessage($like_s);

	$likeNum=$like+1;

	$sql="update comment set likeNum='".$likeNum."' where cid=".$cid."";
	$result=squery("helping",$sql,$link);

	if($result!=false){
		$like_sql="select likeNum from comment where cid=".$cid."";
		$like_s=squery("helping",$like_sql,$link);	
		$like=echoMessage($like_s);

		if($like!=null){
			echo '{"success": true,"commentLikeNum":'.$like.'}';
		}else{
			echo '{"success": true,"commentLikeNum":0}';
		}
	}else{
		echo '{"success": false,"info ":"点赞失败"}';
	}

}

?>