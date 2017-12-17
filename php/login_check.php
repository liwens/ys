<?php
session_start();

//if($_SERVER['REMOTE_PORT']=='POST'){
	$request=$_REQUEST["require"];
	//登陆验证
	if($request=="login"){
		$name=$_REQUEST["account"];
		$passwd=$_REQUEST["password"];
		
		require_once ("connection.php");
		$link=connection();
		$sql="select * from user where username='".$name."' and password='".$passwd."'";
		$result=squery("helping",$sql,$link);
				
		if(mysql_num_rows($result) == 0){
			/*echo "<script type='text/javascript'>";
			echo "alert('用户名或密码输入错误！');";
			echo "history.back();";
			echo "</script>";
			*/
			$check='{"success":false,"info":"用户名或密码输入错误"}';
			echo $check;
		}else{

			$a_sql="select avatar from user where username='".$name."'";
			$avatar=squery("helping",$a_sql,$link);	
			$avatarArry=mysql_fetch_assoc($avatar);
			//遍历查询结果并将其赋值给$avatarForeach
			foreach ($avatarArry as $avatarForeach){ 
      			$avatarResult=$avatarForeach;
    		} 	

    		$n_sql="select uid from user where username='".$name."'";
			$number=squery("helping",$n_sql,$link);	
			$numArry=mysql_fetch_assoc($number);
			//遍历查询结果并将其赋值给$numResult
			foreach ($numArry as $numForeach){ 
      			$uid=$numForeach;
    		} 	

    		$r_sql="select count('readed') from remind where uid='".$uid."' and readed=0";
			$read=squery("helping",$r_sql,$link);	
			$readArry=mysql_fetch_assoc($read);
			//遍历查询结果并将其赋值给$avatarForeach
			foreach ($readArry as $readForeach){ 
      			$readResult=$readForeach;
    		} 	
    		if($readResult==''){
    			$readResult=0;
    		}


			$check='{"success":true,"username":"'.$name.'","uid":"'.$uid.'","avatarUrl":"'.$avatarResult.'","interactiveMsgNum":"'.$readResult.'","systemMsgNum":"0"}';
			echo $check;
			$_SESSION["passed"]="true";	
		
		}
	}


/*	//判断验证码是否正确
	if($request_capt=="captcha")
	{
		$recaptcha=$_SESSION['authcode'];
		$captcha=$_POST["captchaStr"];
		if($captcha!= $recaptcha)
		{
			$checkCaptcha='{"success":false,"info":"验证码输入错误"}';
			echo $checkCaptcha;
		}else
		{
			$checkCaptcha='{"success":true,"info":"验证码输入正确"}';
			echo $checkCaptcha;
		}
	}*/

//}

?>
