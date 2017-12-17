	wangEditor.config.mapAk = 'hCBcm8H8opRLdC0f6OibbGavC0pne1uc';
	//调用编辑器
	var editor = new wangEditor('editorBody');
     editor.config.menus = $.map(wangEditor.config.menus, function(item, key) {
          if (item === 'insertcode') {//清除代码输入
              return null;
          }
          if (item === 'fullscreen') {//清除全屏
              return null;
          }
          return item;
      });		
      editor.config.uploadImgUrl = 'php/img.php';
     editor.config.uploadParams = {
		requirt:"imgs"
    };
    editor.config.mapAk = "hCBcm8H8opRLdC0f6OibbGavC0pne1uc";
   
	editor.create();	