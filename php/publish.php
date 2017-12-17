<?php
function echoMessage($content){
	$numArry=mysql_fetch_assoc($content);
	if(is_array($numArry)){
		foreach ($numArry as $result){ 
      					return $result;
    				} 
    		}
}
/*-------------------获取帖子内容并写入数据库--------------------------------*/
//content,  type,  sitename,  site_latlng ,  uid,  username
$content=$_REQUEST["content"];
$type=$_REQUEST["type"];
$sitename=$_REQUEST["sitename"];
$site_latlng=$_REQUEST["site_latlng"];
$uid=$_REQUEST["uid"];
$time=date("Y-m-d H:i:s");
$likeNum=0;

require_once("connection.php");
$link=connection();
$sql="insert into article (uid,content,time,label,address,location,likeNum) values (".$uid.",'".$content."','".$time."','".$type."','".$sitename."','".$site_latlng."',".$likeNum.")";
$result=squery("helping",$sql,$link);		

if($result!=false){
	//返回用户名
	$n_sql="select aid from article order by time desc";
	$name=squery("helping",$n_sql,$link);	
	$numArry=mysql_fetch_assoc($name);
	//遍历查询结果并将其赋值给$numResult
	foreach ($numArry as $numForeach){ 
			$nameResult=$numForeach;
	} 	

	/*输出当前用户发表的最新的一条帖子*/
	$sql="select * from article where aid=".$nameResult."";
	$orderMessage=squery("helping",$sql,$link);

	if($orderMessage){
		$info = mysql_fetch_assoc($orderMessage);
			
		$user_sql="select username from user where uid=".$info["uid"]."";
		$username_s=squery("helping",$user_sql,$link);	
		$username=echoMessage($username_s);

		$avatar_sql="select avatar from user where uid=".$info["uid"]."";
		$avatarUrl_s=squery("helping",$avatar_sql,$link);
		$avatarUrl=echoMessage($avatarUrl_s);

		$comment_sql="select * from comment where aid=".$nameResult."";
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

		echo '{"success":"true","info":"发布成功","lists":'.json_encode($jsonArray).'}';

				//echo '{"success":true,"info":"发布成功"}';
	}else{
		echo '{"success":false,"info":"请稍后再试"}';
		echo mysql_error();
	}
}
?>
