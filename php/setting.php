<?php

$request=$_REQUEST["require"];

if($request=="changeHeadImg")
{
	$imgbaseurl=$_REQUEST["imgbaseUrl"];
    $uid=$_REQUEST["uid"];



//将图片转换成base64
function image_base64($image_file){
 if(empty($image_file))return false;
 $image_info = getimagesize($image_file);
 $base64_image_content = "data:{$image_info['mime']};base64," . chunk_split(base64_encode(file_get_contents($image_file)));
 return $base64_image_content;
}


//反编译base64数据流并生成图片文件
function base64DecImg($baseData, $Dir, $fileName,$uid){
    //前台访问URL API
    $__URL__= 'http:/127.0.0.1/php/';
    //服务器根目录绝对路径获取API
    $__root__=isset($_SERVER['DOCUMENT_ROOT'])?$_SERVER['DOCUMENT_ROOT']:(isset($_SERVER['APPL_PHYSICAL_PATH'])?trim($_SERVER['APPL_PHYSICAL_PATH'],"\\"):(isset($_['PATH_TRANSLATED'])?str_replace($_SERVER["PHP_SELF"]):str_replace(str_replace("/","\\",isset($_SERVER["PHP_SELF"])?$_SERVER["PHP_SELF"]:(isset($_SERVER["URL"])?$_SERVER["URL"]:$_SERVER["SCRIPT_NAME"])),"",isset($_SERVER["PATH_TRANSLATED"])?$_SERVER["PATH_TRANSLATED"]:$_SERVER["SCRIPT_FILENAME"])));
    try{
    	//explode将字符串打散为数组
        $expData = explode(';',$baseData);//data:image/jpeg获取类型
        $postfix   = explode('/',$expData[0]);//拆分data:image  jpeg
        if( strstr($postfix[0],'image')/*搜索字符串并返回字符串剩余部分，无则返回false*/ ){
            $postfix   = $postfix[1] == 'jpeg' ? 'jpg' : $postfix[1];
            $storageDir = $Dir.'/'.$fileName.'.'.$postfix;
            $export = base64_decode(str_replace("{$expData[0]};base64,", '', $baseData));
            $returnDir = str_replace($__root__,'',$storageDir);
            try{
            	//file_put_contents($a,$b)将$b写入$a中
                file_put_contents($storageDir, $export);
                $Rurl='php/'.$returnDir;

                require_once("connection.php");
				$link=connection();
				//将文件路径写入数据库中
				$sql="update user set avatar='".$Rurl."' where uid=".$uid."";
				$result=squery("helping",$sql,$link);
				
                if($result!=false){
					return '{"success":true,"url":"'.$Rurl.'"}';
				}else{
					return '{"success":false}';

				}

            }catch(Exception $e){
                return false;
            }
        }
    }catch(Exception $e){
        return false;
    }
    return false;
}

/*
//-----------------测试----------------------------------------------------
//$imgbaseurl=image_base64('test.txt');
//echo $imgbaseurl;
$imgbaseurl=image_base64('testImg.jpg');
//-----------------测试----------------------------------------------------
//*/

$fileName = uniqid("img_".md5(""));
echo base64DecImg($imgbaseurl,"upload",$fileName,$uid);

//echo $imgbaseurl;

}



/*if($request=="settingInfo")
{
	
}*/

?>