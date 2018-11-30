/**
 * @file 工具函数
 */
define( [

], function( ) {
    'use strict';

    return {
        /**
         * 将文本复制到剪切板
         * @param { String } text 要复制的文本
         */
        copyToClipboard: function ( text ) {
            if( text.indexOf('-') !== -1 ) {
                let arr = text.split('-');
                text = arr[0] + arr[1];
            }
            var textArea = document.createElement( "textarea" );
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
            document.body.appendChild( textArea );
            textArea.select();

            try {
                var successful = document.execCommand( 'copy' );
                var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
                // alert(msg);
            } catch (err) {
                // alert('该浏览器不支持点击复制到剪贴板');
            }

            document.body.removeChild( textArea );
        },

        /**
         * 全屏
         */
        requestFullScreen: function ( element ) {
            var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen ||             element.mozRequestFullScreen || element.msRequestFullScreen;
            if ( requestMethod ) {
                requestMethod.call( element );
            } else if ( typeof window.ActiveXObject !== 'undefined' ) {
                var wscript = new ActiveXObject( 'WScript.Shell' );
                if ( wscript !== null ) {
                    wscript.SendKeys( '{F11}' );
                }
            }
        },

        /**
         * 退出全屏
         */
        exitFull: function () {

            // 判断各种浏览器，找到正确的方法
            var exitMethod = document.exitFullscreen || //W3C
            document.mozCancelFullScreen ||     //Chrome等
            document.webkitExitFullscreen ||    //FireFox
            document.webkitExitFullscreen;  //IE11
            if ( exitMethod ) {
                exitMethod.call( document );
            }
            else if ( typeof window.ActiveXObject !== "undefined" ) {   //for Internet Explorer
                var wscript = new ActiveXObject( "WScript.Shell" );
                if ( wscript !== null ) {
                    wscript.SendKeys( "{F11}" );
                }
            }
        },

        support: {
            chrome: false
        }
    };
} );
