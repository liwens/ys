<?php 
/*-------------------获取上传的图片并返回浏览--------------------------------*/
//print_r($_FILES["upfile"]); 
if(is_uploaded_file($_FILES['wangEditorH5File']['tmp_name'])){ 
$upfile=$_FILES["wangEditorH5File"]; 
//获取数组里面的值 
$name=$upfile["name"];//上传文件的文件名 
$type=$upfile["type"];//上传文件的类型 
$size=$upfile["size"];//上传文件的大小 
$tmp_name=$upfile["tmp_name"];//上传文件的临时存放路径 
//判断是否为图片 
switch ($type){ 
case 'image/pjpeg':$okType=true; 
break; 
case 'image/jpeg':$okType=true; 
break; 
case 'image/gif':$okType=true; 
break; 
case 'image/png':$okType=true; 
break; 
} 

if($okType){ 
/** 
* 0:文件上传成功<br/> 
* 1：超过了文件大小，在php.ini文件中设置<br/> 
* 2：超过了文件的大小MAX_FILE_SIZE选项指定的值<br/> 
* 3：文件只有部分被上传<br/> 
* 4：没有文件被上传<br/> 
* 5：上传文件大小为0 
*/ 
$error=$upfile["error"];//上传后系统返回的值 
/*echo "================<br/>"; 
echo "上传文件名称是：".$name."<br/>"; 
echo "上传文件类型是：".$type."<br/>"; 
echo "上传文件大小是：".$size."<br/>"; 
echo "上传后系统返回的值是：".$error."<br/>"; 
echo "上传文件的临时存放路径是：".$tmp_name."<br/>"; 

echo "开始移动上传文件<br/>"; */
//把上传的临时文件移动到up目录下面 
move_uploaded_file($tmp_name,'articleImg/'.$name); 
$destination="articleImg/".$name; 
/*echo "================<br/>"; 
echo "上传信息：<br/>"; */
if($error==0){ 
/*echo "文件上传成功啦！"; 
echo "<br>图片预览:<br>"; 
echo "<img src=".$destination.">"; */
//echo " alt=\"图片预览:\r文件名:".$destination."\r上传时间:\">"; 
//输出图片URL
echo 'php/'.$destination;

}elseif ($error==1){ 
echo "超过了文件大小，在php.ini文件中设置"; 
}elseif ($error==2){ 
echo "超过了文件的大小MAX_FILE_SIZE选项指定的值"; 
}elseif ($error==3){ 
echo "文件只有部分被上传"; 
}elseif ($error==4){ 
echo "没有文件被上传"; 
}else{ 
echo "上传文件大小为0"; 
} 
}else{ 
echo "请上传jpg,gif,png等格式的图片！"; 
} 
} 



?> 