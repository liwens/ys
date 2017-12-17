<?php
function echoMessage($content){
	$numArry=mysql_fetch_assoc($content);
	if(is_array($numArry)){
		foreach ($numArry as $result){ 
      			return $result;
    	} 
    }
}

if(isset($_REQUEST["uid"])){
	$uid=$_REQUEST["uid"];

	require_once("connection.php");
	$link=connection();
	$aid_sql="select aid from comment where uid=".$uid."";
	$aid_result=squery("helping",$aid_sql,$link);

	$jsonArray=array();

	if($aid_result){
		$rows=mysql_num_rows($aid_result);
		for($i=0;$i<=$rows;$i++){
			$aid=@mysql_result($aid_result,$i);
			
			$article_sql="select * from article where aid=".$aid."";
			$article_result=squery("helping",$article_sql,$link);

			if($article_result){
				while ($info = mysql_fetch_assoc($article_result)) {

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

				

			}
		}

		if($jsonArray!==''){
			echo '{"success":"true","lists":'.json_encode($jsonArray).'}';
		}else{
			echo '{"success":"false","lists":'.mysql_error().'}';
		}

	}
}
?>
