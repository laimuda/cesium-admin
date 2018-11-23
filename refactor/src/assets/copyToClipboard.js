define( [

], function( ) {
    'use strict';

    return function (text) {
        if(text.indexOf('-') !== -1) {
            let arr = text.split('-');
            text = arr[0] + arr[1];
        }
        var textArea = document.createElement("textarea");
          textArea.style.position = 'fixed';
          textArea.style.top = '0';
          textArea.style.left = '0';
          textArea.style.width = '2em';
          textArea.style.height = '2em';
          textArea.style.padding = '0';
          textArea.style.border = 'none';
          textArea.style.outline = 'none';
          textArea.style.boxShadow = 'none';
          textArea.style.background = 'transparent';
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();

          try {
            var successful = document.execCommand('copy');
            var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
        //    alert(msg);
          } catch (err) {
            // alert('该浏览器不支持点击复制到剪贴板');
          }

          document.body.removeChild(textArea);
    };
} );
