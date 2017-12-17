<?php
function echoMessage($content){
	$numArry=mysql_fetch_assoc($content);
	if(is_array($numArry)){
		foreach ($numArry as $result){ 
      					return $result;
    				} 
    		}
}

$jsonArray = array();

//if(is_array($_REQUEST)&&count($_REQUEST)>0){
	if(isset($_REQUEST["uid"])){
		$Ruid=$_REQUEST["uid"];
		require_once("connection.php");
		$link=connection();
		$sql="select * from article where uid=".$Ruid." order by time desc ";
		$result=squery("helping",$sql,$link);

		if($result){
			while($info=mysql_fetch_assoc($result)){
				$user_sql="select username from user where uid=".$info["uid"]."";
				$username_s=squery("helping",$user_sql,$link);	
				$username=echoMessage($username_s);

				$avatar_sql="select avatar from user where uid=".$info["uid"]."";
				$avatarUrl_s=squery("helping",$avatar_sql,$link);
				$avatarUrl=echoMessage($avatarUrl_s);

				$aid=$info["aid"];
				$content=$info["content"];
				$site=$info["address"];
				$site_latlng=$info["location"];
				$time=$info["time"];
				$zan=$info["likeNum"];

				$comment_sql="select * from comment where aid=".$aid."";
				$comment_s=squery("helping",$comment_sql,$link);
				$comment=mysql_num_rows($comment_s);

				$array=array(
					"avatarUrl" => $avatarUrl,
					"username" => $username,
					"time" => $time,
					"content" => $content,
					"site" => $site,
					"site_latlng" => $site_latlng,
					"zan" => $zan,
					"comment" => $comment,
					"aid" => $aid
					);

				//$jsonArray[]=("".$aid.",'".$avatarUrl."','".$comment."','".$content."','".$site."','".$site_latlng."',".$time.",".$zan."");
				array_push($jsonArray,$array);

			}

			echo '{"success":"true","lists":'.json_encode($jsonArray).'}';

		}else{

			echo '{"success":"false","lists":'.mysql_error().'}';//返回错误信息 

		}
	}else{
		require_once ("connection.php");
		$link=connection();
		$sql="select * from article order by time desc";
		$orderMessage=squery("helping",$sql,$link);

		if($orderMessage){
			while ($info = mysql_fetch_assoc($orderMessage)) {
				
				$user_sql="select username from user where uid=".$info["uid"]."";
				$username_s=squery("helping",$user_sql,$link);	
				$username=echoMessage($username_s);

				$avatar_sql="select avatar from user where uid=".$info["uid"]."";
				$avatarUrl_s=squery("helping",$avatar_sql,$link);
				$avatarUrl=echoMessage($avatarUrl_s);

				$aid=$info["aid"];
				$content=$info["content"];
				$site=$info["address"];
				$site_latlng=$info["location"];
				$time=$info["time"];
				$zan=$info["likeNum"];

				$comment_sql="select * from comment where aid=".$aid."";
				$comment_s=squery("helping",$comment_sql,$link);
				$comment=mysql_num_rows($comment_s);

				$array=array(
					"avatarUrl" => $avatarUrl,
					"username" => $username,
					"time" => $time,
					"content" => $content,
					"site" => $site,
					"site_latlng" => $site_latlng,
					"zan" => $zan,
					"comment" => $comment,
					"aid" => $aid
					);

				//$jsonArray[]=("".$aid.",'".$avatarUrl."','".$comment."','".$content."','".$site."','".$site_latlng."',".$time.",".$zan."");
				array_push($jsonArray,$array);

			}

			echo '{"success":"true","lists":'.json_encode($jsonArray).'}';

		}else{

			echo '{"success":"false","lists":'.mysql_error().'}';//返回错误信息 

		}
}
?>
