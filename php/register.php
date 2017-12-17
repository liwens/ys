<?php
//开启session
session_start();
//获取随机验证码
$recaptcha=$_SESSION['authcode'];

//if($_SERVER["REQUEST_METHOD"]=='GET'){
	$request=addslashes($_REQUEST["require"]);
	//echo $name;
	//TEST
	//$result=1;	
	//验证用户名是否可用
	if($request=="accountCheck"){
		$name=addslashes($_REQUEST["account"]);
		require_once("connection.php");
		$link=connection();
		$sql="select * from user where username='".$name."'";
		$result=squery("helping",$sql,$link);
		//echo mysql_num_rows($result);
		//echo $name;
		if(mysql_num_rows($result)!=0){
			$check='{"success":false,"info":"已注册"}';
			echo $check;
			
		}else{
			
			mysql_free_result($result);
			$check='{"success":true,"info":"账号可用"}';
			echo $check;			
		}
	}

   //判断验证码是否正确
	if($request=="captcha"){
		$captcha=$_REQUEST["captchaStr"];
		if($captcha!= $recaptcha){
			$checkCaptcha='{"success":false,"info":"验证码输入错误"}';
			echo $checkCaptcha;
		}else{
			$checkCaptcha='{"success":true,"info":"验证码输入正确"}';
			echo $checkCaptcha;
		}
	}
//}

//if($_SERVER["REQUEST_METHOD"]=='POST'){
	//$request=addslashes($_REQUEST["require"]);
	//将用户信息写入数据库
	if($request=="register"){
		$name=$_REQUEST["account"];
		$passwd=$_REQUEST["password"];
		$email=$_REQUEST["email"];
		$sex=$_REQUEST["sex"];
		if($sex==1){
			$defaultAvatar="php/upload/defaultAvatar1.jpg";
		}else{
			$defaultAvatar="php/upload/defaultAvatar.jpg";
		}

		
		require_once("connection.php");
		$link=connection();
		$sql="insert into user (username,password,email,sex,avatar) values ('".$name."','".$passwd."','".$email."','".$sex."','".$defaultAvatar."')";
		$result=squery("helping",$sql,$link);		
		//TEST
		//$result=1;
		
		if($result!=false){
			$n_sql="select uid from user where username='".$name."'";
			$number=squery("helping",$n_sql,$link);	
			$numArry=mysql_fetch_assoc($number);
			//遍历查询结果并将其赋值给$numResult
			foreach ($numArry as $numForeach){ 
      			$numResult=$numForeach;
    		} 	
			echo '{"success":true,"info":"'.$name.'注册成功","number":"'.$numResult.'"}';
		}else{
			echo '{"success":false,"info":"注册失败"}';
		}
		
		//exit();
	}
//}


?>