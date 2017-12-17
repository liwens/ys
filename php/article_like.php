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

	if($require=='articleLike'){
		$aid=$_REQUEST["aid"];

		$operUid=$_REQUEST["uid"];

		require_once ("connection.php");
		$link=connection();

		$zan_sql="select likeNum from article where aid=".$aid."";
		$zan_s=squery("helping",$zan_sql,$link);	
		$zan=echoMessage($zan_s);

		$likeNum=$zan+1;

		$sql="update article set likeNum='".$likeNum."' where aid=".$aid."";
		$result=squery("helping",$sql,$link);

		if($result!=false){
			/***************将评论信息写入remind表****************/
			$remind_uid_sql="select uid from article where aid=".$aid."";
			$remind_uid_s=squery("helping",$remind_uid_sql,$link);
			$uid=echoMessage($remind_uid_s);
			$type=1;
			$readed=1;
			$time=date("Y-m-d H:i:s");

			$remind_input_sql=" insert into remind (uid,aid,type,readed,time,operUid) values('".$uid."','".$aid."','".$type."','".$readed."','".$time."','".$operUid."')";
			$remind_input_result=squery("helping",$remind_input_sql,$link);
			/***************将评论信息写入remind表****************/

			$zan_sql="select likeNum from article where aid=".$aid."";
			$zan_s=squery("helping",$zan_sql,$link);	
			$zan=echoMessage($zan_s);

			if($zan!=null){
				echo '{"success": true,"lick_num":'.$zan.'}';
			}else{
				echo '{"success": true,"lick_num":0}';
			}
		}else{
			echo '{"success": false,"info ":"点赞失败"}';
		}
	}

?>