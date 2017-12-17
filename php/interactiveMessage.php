<?php
function echoMessage($content){
	$numArry=mysql_fetch_assoc($content);
	if(is_array($numArry)){
		foreach ($numArry as $result){ 
      					return $result;
    				} 
    		}
}


if(isset($_REQUEST['uid'])){
	$uid=$_REQUEST['uid'];
	require_once("connection.php");
	$link=connection();
	//查询语句：查找：当user表的uid等于当前用户uid的所有操作用户uid时，并且remind表下的uid等于当前用户uid，并且article表下的uid等于当前用户uid 时的remind.type,user.avatar,user.username,article.time,remind.time,remind.readed
	//$remind_sql="select remind.type as controlType, user.avatar as avatarUrl,user.userName,remind.time as controlTime,article.time as articlePublishTime,remind.readed from user,remind,article where user.uid=all(select operUid from remind where uid=".$uid.") and remind.uid=83 and article.uid=".$uid."";
	//$remind_result=squery("helping",$remind_sql,$link);
	
	$remind_sql="select type as controlType,time as controlTime,readed from remind where uid=".$uid."
		";
	$remind_result=squery("helping",$remind_sql,$link);



	$user_sql="select avatar as avatarUrl,username as userName from user where uid in (select operUid from remind where uid=".$uid.")";
	$user_result=squery("helping",$user_sql,$link);

	$time_sql="select time as articlePublishTime from article where uid=".$uid."";
	$time_result=squery("helping",$time_sql,$link);

		//定义一个空数组
		$arrayJson = array();
		//当数据库语句查询成功时将数据写入$arrayJson,并输出json
		if(mysql_num_rows($remind_result)&&mysql_num_rows($user_result)&&mysql_num_rows($time_result)){
		//将数据库查询结果写入数组$remind_array,每获取一行便写入函数$remind_Json
		while(($remind_array=mysql_fetch_assoc($remind_result))&&($user_array=mysql_fetch_assoc($user_result))&&($time_array=mysql_fetch_assoc($time_result))){
			$remind_Json=array(
				"controlType" => $remind_array["controlType"],
				"avatarUrl" => $user_array["avatarUrl"],
				"controlTime" => $remind_array["controlTime"],
				"userName" => $user_array["userName"],
				"articlePublishTime" => $time_array["articlePublishTime"],
				"readed" => $remind_array["readed"],
				);
			/*$user_Json=array(
				"avatarUrl" => $user_array["avatarUrl"],
				"username" => $user_array["username"],
				);
			$time_Json=array(
				"articlePublishTime" => $time_array["articlePublishTime"]
				);*/
			/*array_push($arrayJson,$remind_Json);
			array_push($arrayJson,$user_array);
			array_push($arrayJson,$time_array);*/
			array_push($arrayJson,$remind_Json);
		}
		//当数据成功写入$arrayJson
		//if($arrayJson){
			//输出结果
			echo '{"success":"true","lists":'.json_encode($arrayJson).'}';
			//用户浏览数据后将readed字段值改为0，表示已读
			$update_sql="update remind set readed=0 where uid=".$uid."";
			$remind_result=squery("helping",$update_sql,$link);
		//}else{
			//echo '{"success":false,"lists":'.mysql_error().'}';
		//} 
		
			mysql_close($link);

	}else{
		echo '{"success":false,"lists":'.mysql_error().'}';
	} 
}


/*
sql语句
select type as controlType,avatar as avatarUrl,username,remind.time as controlTime,article.time as articlePublishTime,readed  from user,remind,article where user.uid=all(select operUid from remind where uid='.$uid.') and remind.uid='.$uid.' and article.uid=all(select uid from remind where operUid='.$uid.');

article.time as articlePublishTime,

select type as controlType, avatar as avatarUrl,username,remind.time as controlTime,article.time as articlePublishTime,readed from user,remind,article where user.uid=all(select operUid from remind where uid=84) and remind.uid=84 and article.uid=84;
*/

?>