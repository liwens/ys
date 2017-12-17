<?php
function echoMessage($content){
	$numArry=mysql_fetch_assoc($content);
	if(is_array($numArry)){
		foreach ($numArry as $result){ 
      					return $result;
    				} 
    		}
}

$aid=$_REQUEST["aid"];

$jsonArray = array();

require_once ("connection.php");
$link=connection();
	/*输出当前用户发表的最新的一条帖子*/
	$sql="select * from article where aid=".$aid."";
	$orderMessage=squery("helping",$sql,$link);

	if($orderMessage){
		$info = mysql_fetch_assoc($orderMessage);
			
		$user_sql="select username from user where uid=".$info["uid"]."";
		$username_s=squery("helping",$user_sql,$link);	
		$username=echoMessage($username_s);

		$avatar_sql="select avatar from user where uid=".$info["uid"]."";
		$avatarUrl_s=squery("helping",$avatar_sql,$link);
		$avatarUrl=echoMessage($avatarUrl_s);

		$comment_sql="select * from comment where aid=".$aid."";
		$comment_s=squery("helping",$comment_sql,$link);
		$comment=mysql_num_rows($comment_s);


		$aid=$info["aid"];
		$content=$info["content"];
		$site=$info["address"];
		$site_latlng=$info["location"];
		$time=$info["time"];
		$zan=$info["likeNum"];

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
		$jsonArray=array();
		//$jsonArray[]=("".$aid.",'".$avatarUrl."','".$comment."','".$content."','".$site."','".$site_latlng."',".$time.",".$zan."");
		array_push($jsonArray,$array);
	/*------------------------*/

		echo '{"success":"true","lists":'.json_encode($jsonArray).'}';

}else{

	echo '{"success":"false","lists":'.mysql_error().'}';//返回错误信息 

}
?>