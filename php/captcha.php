<?php
session_start();
//画布
$image=imagecreatetruecolor(100,30);
$bgcolor=imagecolorallocate($image,255,255,255);
imagefill($image,0,0,$bgcolor);

$captch_code='';

//生成验证码
for($i=0;$i<4;$i++)
{
	$fontsize=6;
	$fontcolor=imagecolorallocate($image,rand(0,100),rand(0,100),rand(0,100));
	$data="0123456789";
	$fontcontent=substr($data,rand(1,strlen($data)-1),1);
	$captch_code.=$fontcontent;
	
	$x=($i*100/4)+rand(5,10);
	$y=rand(5,10);
	
	imagestring($image,$fontsize,$x,$y,$fontcontent,$fontcolor);
	
}
//将生成的验证码放入session
$_SESSION['authcode']=$captch_code;

//添加噪点
for($i=0;$i<200;$i++){
	$dotcolor=imagecolorallocate($image,rand(50,200),rand(50,200),rand(50,200));
	imagesetpixel($image,rand(1,99),rand(1,99),$dotcolor);
}

//添加干扰元素——线
for($i=0;$i<3;$i++){
	$linecolor=imagecolorallocate($image,rand(80,220),rand(80,220),rand(80,220));
	imageline($image,rand(1,99),rand(1,29),rand(1,99),rand(1,29),$linecolor);
}

/*echo $_SESSION['authcode'];*/
header('content-type:image/png');
imagepng($image);
imagedestroy($image);


?>