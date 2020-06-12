$(function () {
    let currentIndex = 0;

    // 保存天气数据
    let weatherData = [];
    $('.title-item').on('click', function () {
    
        let index = $(this).index();
        if (currentIndex == index) {
            console.log("当前已选中");
            return;
        }
        $('.weather-list').empty();
        currentIndex = index;
        // 获取html的font-size
        let fontSize = parseFloat($('html').css('font-size'));
        // 获取当前元素的宽度
        let currentWidth = $(this).width();
        // 将当前长度变成rem
        var distance = currentWidth / fontSize + 0.4;
        // 移动下划线
        $('.move-line').animate({
            left: index * distance + 'rem',
        }, 200)

        // 点击之后获取数据类型
        let type = $(this).data("type");
        console.log("type==>", type);
        DailyHourly(weatherData[type], type);
    })

    $('.search-icon').on('click', function () {
        let city = $('.search-ipt').val();
        getWeatherByCity(city);
    })

    function getWeatherByCity(city) {
        $.ajax({
            type: 'GET',
            url: 'https://api.heweather.net/s6/weather/',
            data: {
                location: city,
                key: 'a78b8825213d457aa43012b6192e9f86'
            },
            success: function (result) {
                console.log("实际天气==>", result);
                // 如果城市不存在
                if (result.HeWeather6[0].status == "unknown location") {
                    console.log("城市不尊在")
                    return;
                }
                // 清空预报内容
                $('.weather-list').empty();

                weatherData = result.HeWeather6[0];
                let weather = result.HeWeather6[0];
                $('#location').text(weather.basic.location);
                $('#tmp').text(weather.now.tmp);
                $('cond_txt').text(weather.now.cond_txt);

                $('.w').each(function () {
                    let id = $(this).attr('id');
                    $(this).text(weather.now[id]);
                })

                let tmp_max = weather.daily_forecast[0].tmp_max;
                let tmp_min = weather.daily_forecast[0].tmp_min;
                var tmp_str = `${tmp_min}℃~${tmp_max}℃`;
                $('#tmp_range').text(tmp_str);

                DailyHourly( weather.daily_forecast,"daily_forecast");

            },
            error: function (err) {
                console.log(err)
            }
        })
    }

    function locationIP() {
        $.ajax({
            type: 'get',
            url: 'https://apis.map.qq.com/ws/location/v1/ip',
            data: {
                key: "KEABZ-L2PK3-ZFC3M-YVH6X-X62G5-5MBGN",
                output: 'jsonp'
            },
            dataType: 'jsonp',
            success: function (result) {
                console.log('您当前的地址是==>', result);
                getWeatherByCity(result.result.ad_info.city);
            },
            error: function (err) {
                console.log('err==>', err);
            }
        })
    }
    function DailyHourly(data, type) {
        console.log(type);
        let str = '';
        if (type == "daily_forecast") {
            console.log("yess",data)
            for (let i = 0; i < data.length; i++) {
                let date = data[i].date.slice(5);
                str += `<div class="weather-item fl">
                                <div class="date">
                                    <div>${date}</div>
                                    <div>${data[i].cond_txt_d}</div>
                                </div>
                                <div class="weather-icon">
                                   <img src="./images/icons/${data[i].cond_code_d}.png" class="auto-img" alt="">
                                </div>
                                <div class="date">${data[i].tmp_min}℃~${data[i].tmp_max}℃</div>
                            </div>`
            }
           

        } else {
            console.log(data)
            // console.log("点击了逐时预报=>",data)
            for (let i = 0; i < data.length; i++) {
                let time = data[i].time.split(' ')[1];
                str += `<div class="weather-item fl">
                            <div class="date">
                                <div>${time}</div>
                                <div>${data[i].cond_txt}</div>
                            </div>
                            <div class="weather-icon">
                                <img src="./images/icons/${data[i].cond_code}.png" class="auto-img" alt="">
                            </div>
                            <div class="date">${data[i].tmp}℃</div>
                        </div>`
            }
        }
        $('.weather-list').append(str);
        $('.weather-list').css({
            width: 0.8 * data.length + 'rem'
        })
    }

    function setBackground() {
        // 获取事件，早上是6点12点是早上， 12点
        let time = new Date().getHours();
        
        let $weatherBox = $('.weather-box');
        let bgclass = ""
        
        if(time >= 6 && time < 12){
            bgclass = "morning"
        }else if(time >= 12 && time <= 19){
            bgclass = "afternoon"
        }else{
            bgclass = "night"
        }
        $weatherBox.addClass(bgclass);
        console.log(bgclass)
    }

    // locationIP()
    setBackground()
})