(function () {
    function setRem() {
        // 获取屏幕宽度（页面宽度）
        let pageWidth = innerWidth;
        // console.log('pageWidth==>',pageWidth);

        // 以iphone6作为标准屏幕进行设置rem，设置html的fontsize
        let baseWidth = 375;
        let fontSize = pageWidth / baseWidth *100;
        // console.log("fontsize==>",fontSize);

        document.getElementsByTagName('html')[0].style.fontSize = fontSize+'px';
    }
    setRem();
    window.onresize = function() {
        setRem();
    }
})()