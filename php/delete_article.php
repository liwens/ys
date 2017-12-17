<?php
if(is_array($_REQUEST)&&count($_REQUEST)>0){
	if(isset($_REQUEST["deleteAid"])){
		$deleteAid=$_REQUEST["deleteAid"];
		require_once("connection.php");
		$link=connection();
		$deleteArticle_sql="delete from article where aid=".$deleteAid."";
		$deleteArticle_result=squery("helping",$deleteArticle_sql,$link);

		$deleteComment_sql="delete from comment where aid=".$deleteAid."";
		$deleteComment_result=squery("helping",$deleteComment_sql,$link);

		if($deleteArticle_result&&$deleteComment_result){
			echo '{"success":true,"info":"删除成功" }';

		}else{
			echo '{"success":false,"info":"删除失败" }';
		}
	}
}

?>