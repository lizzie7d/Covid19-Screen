// 地图的疫情分布
(function () {
    var myChart = echarts.init(document.querySelector(".map .china"), 'dark');
    option = {
        backgroundColor: 'transparent',
        title: {
            text: '中国新冠疫情分布图（现存确诊病例）',
            left: 'center',
            y: '70px',
        },
        tooltip: {
            trigger: 'item'
        },
        // 图例
        legend: {
            top: 'auto',
            orient: 'vertical',
            data: ['中国疫情图']
        },
        // 分类
        visualMap: {
            top: 120,
            left: 30,
            orient: 'horizontal',
            type: 'piecewise',
            pieces: [
                { min: 1000, max: 1000000, label: '大于等于1000人', color: 'red' },
                { min: 500, max: 999, label: '确诊500-999人', color: '#4e160f' },
                { min: 100, max: 499, label: '确诊100-499人', color: '#974236' },
                { min: 10, max: 99, label: '确诊10-99人', color: '#ee7263' },
                { min: 1, max: 9, label: '确诊1-9人', color: '#f5bba7' },
                { max: 1, label: '无确诊', color: 'transparent' },

            ],
            color: ['#E0022B', '#E09107', '#A3E00B']
        },


        //  地图缩放快捷键
        roamController: {
            show: true,
            left: 'right',
            mapTypeControl: {
                'china': true
            }
        },
        series: [{
            name: '确诊数',
            type: 'map',
            mapType: 'china',
            roam: false,
            label: {
                show: true,
                color: 'rgb(249, 249, 249)'
            },
            data: [],
            itemStyle: {
                areaColor: {
                    x: 0.5,
                    y: 0.5,
                    r: 3,
                },
                borderWidth: 1, // 边框大小
                borderColor: "rgba(104, 152, 190, 1)", // 边框样式
                shadowColor: "rgba(128, 217, 248, 1)", // 阴影颜色
                shadowOffsetX: -3, // 阴影水平方向上的偏移距离
                shadowOffsetY: 3, // 阴影垂直方向上的偏移距离
                shadowBlur: 3, // 文字块的背景阴影长度}

            }
        }]
    };
    //使用指定的配置项和数据显示图表
    myChart.setOption(option);
    function getData() {
        $.ajax({
            // url: "https://news.163.com/special/epidemic",
            url: "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf",
            // dataType: "json",
            success: function (data) {
                var res = data.data || "";
                var newArr = [];
                console.log(res);
                //newArr的数据格式为：
                // [{
                //   name: '北京11',
                //   value: 212
                // }, {
                //   name: '天津',
                //   value: 60
                // }]
                if (res) {
                    //获取到各个省份的数据
                    var province = res.diseaseh5Shelf.areaTree[0].children;
                    for (var i = 0; i < province.length; i++) {
                        var json = {
                            name: province[i].name,
                            value: province[i].total.nowConfirm
                        }
                        newArr.push(json)
                    }
                    myChart.setOption({
                        series: [{
                            name: '确诊数',
                            type: 'map',
                            mapType: 'china',
                            label: {
                                show: true,
                                color: 'rgb(249, 249, 249)'
                            },
                            data: newArr
                        }]
                    });
                }
            }

        })
    }
    getData();
})();
//左一治愈率饼图
(function () {
    var myColor = ["#1089E7", "#F57474", "#56D0E3"];
    // 1. 实例化对象
    var myChart = echarts.init(document.querySelector(".pie .pieChart"), 'dark');
    // 2. 指定配置和数据
    var option = {
        backgroundColor: 'transparent',
        title: {
            text: '本土疫情治愈率',
            left: 'center'
        },
        // dataZoom: {
        //     type: 'inside',
        // },
        tooltip: {
            trigger: 'item',
            formatter: '{c}%'
        },
        //是每一个指标的位置
        legend: {
            orient: 'horizontal',
            bottom: 40
        },
        series: [
            {
                name: '占比',
                type: 'pie',
                radius: '50%',
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                data: [],
            }
        ]
    };
    // 3. 把配置给实例对象
    myChart.setOption(option);
    function getData() {
        $.ajax({
            url: "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf",
            dataType: 'json',
            // dataType: "jsonp",
            success: function (data) {
                var res = data.data || "";
                var newArr = [];
                console.log(res);
                if (res) {
                    // 留小数点后两位 转换单位 toFixed只能用于number
                    var confirm = res.diseaseh5Shelf.chinaTotal.confirm;
                    var healpersent = (res.diseaseh5Shelf.chinaTotal.heal / confirm) * 100;
                    var heal = Math.floor(healpersent * 100) / 100 + '%';
                    var deadpersent = (res.diseaseh5Shelf.chinaTotal.dead / confirm) * 100;
                    var dead = Math.floor(deadpersent * 100) / 100 + '%';
                    var treatment = ((confirm - res.diseaseh5Shelf.chinaTotal.heal - res.diseaseh5Shelf.chinaTotal.dead) / confirm) * 100;
                    var treat = Math.floor(treatment * 100) / 100 + '%';
                    newArr = [
                        {
                            name: '死亡',
                            value: parseFloat(dead),
                        },
                        {
                            name: '治疗中',
                            value: parseFloat(treat),
                        },
                        {
                            name: '已治愈',
                            value: parseFloat(heal),
                        },

                    ]
                    myChart.setOption({
                        series: [{
                            name: '占比',
                            type: 'pie',
                            radius: '50%',
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            data: newArr
                        }]
                    });
                }
            }
        })
    }
    getData();
    window.addEventListener("resize", function () {
        myChart.resize();
    });
})();
//右二趋势图
(function () {
    var myChart = echarts.init(document.querySelector(".month .monthChart"), 'dark');
    var option = {
        title: {
            text: '30日内本土现有确诊趋势走向',
            left: 'center',
        },
        tooltip: {
            trigger: 'item'
        },
        backgroundColor: 'transparent',
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: {
            type: 'value',
            min: 1000,
            max: 35000
        },
        legend: {
            data: ['中国疫情图'],
        },
        visualMap: [
            {
                show: false,
                type: 'continuous',
                seriesIndex: 0,
                min: 13000,
                max: 18000
            },

        ],
        series: [
            {
                data: [],
                type: 'line',
                areaStyle: {}
            }
        ]
    };
    myChart.setOption(option);
    //累计确诊病例 
    function getData() {
        $.ajax({
            url: "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=chinaDayList",
            dataType: 'json',
            success: function (data) {
                var res = data.data || "";
                console.log(res);
                var monthArr = res.chinaDayList;
                var dateArr = [];
                var numArr = [];
                for (i = 29; i < monthArr.length; i++) {
                    dateArr.push(monthArr[i].date);
                    numArr.push(monthArr[i].localConfirm)
                }
                console.log(numArr);
                myChart.setOption({
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: dateArr,
                    },
                    series: [
                        {
                            data: numArr,
                            type: 'line',
                        }
                    ]
                })

            }
        })
    }
    getData();
    window.addEventListener("resize", function () {
        myChart.resize();
    });

})();
//右一全球现状条形图
(function () {
    var myChart = echarts.init(document.querySelector(".line .worldChart"), 'dark');
    var option = {
        backgroundColor: 'transparent',
        title: {
            text: '其他国家最新疫情数据（确诊病例）',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            // boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: []
        },
        series: [
            {
                type: 'bar',
                data: []
            }
        ]
    };
    //3、把配置给实例对象
    myChart.setOption(option);
    var country = [];
    var countrynum = [];
    function getData() {
        $.ajax({
            url: 'https://api.inews.qq.com/newsqa/v1/automation/foreign/country/ranklist',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                var num = data.data || "";
                for (var i = 14; i >= 0; i--) {
                    country.push(num[i].name);
                    countrynum.push(num[i].confirm);
                }
                myChart.setOption({
                    yAxis: {
                        type: 'category',
                        data: country,
                    },
                    series: [
                        {
                            type: 'bar',
                            data: countrynum,
                        }
                    ]
                })
            }
        })
    }
    getData();
    // 4. 让图表跟随屏幕自动的去适应
    window.addEventListener("resize", function () {
        myChart.resize();
    });
})();
//左二柱状图
(function () {
    var myChart = echarts.init(document.querySelector(".rose .roseChart"), 'dark');
    var option = {
        title: {
            text: '较昨日本土新增确诊病例数TOP10',
            left: 'center',
        },
        backgroundColor: 'transparent',
        xAxis: {
            type: 'category',
            data: []
        },

        tooltip: {
            show: true
        },
        grid: {
            top: '18%',
            left: '10%',  // grid布局设置适当调整避免X轴文字只能部分显示
            right: '10%', // grid布局设置适当调整避免X轴文字只能部分显示
            bottom: '15%',
        },

        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'bar',
                label: {
                    show: true,
                    position: 'top',
                    color: '#fff'
                },
            }]
    };
    myChart.setOption(option);
    function getData() {
        //较昨日新增确诊病例 不包括无症状感染 除去台湾香港澳门
        //而所谓确诊病例，按照诊疗方案有明确的诊断标准，
        // 即病毒学检查阳性，同时有临床症状或血液及影像学检查异常，
        // 其临床严重程度包括轻型、普通型、重型、危重型4种类型
        $.ajax({
            url: "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf",
            success: function (data) {
                var res = data.data || "";
                var result = res.diseaseh5Shelf.areaTree[0].children;
                var arr = [];
                var json = [];
                for (var i = 0; i <= result.length - 1; i++) {
                    if (result[i].name !== '香港' && result[i].name !== '台湾' && result[i].name !== '澳门') {
                        json = {
                            value: result[i].today.confirm,
                            name: result[i].name,
                        }
                        arr.push(json);
                    }
                };
                //比较大小
                function compare(prop) {
                    return function (a, b) {
                        var val1 = a[prop];
                        var val2 = b[prop];
                        return val2 - val1
                    }
                }
                arr.sort(compare('value'));
                //前10个省份
                var newArr1 = [];
                var newArr2 = [];
                for (var i = 0; i < 10; i++) {
                    newArr1.push(arr[i].name);
                    newArr2.push(arr[i].value);

                }
                myChart.setOption({
                    xAxis: {
                        type: 'category',
                        data: newArr1
                    },
                    series: [
                        {
                            data: newArr2,

                        }
                    ]
                })
            }

        })
    }
    getData();
    window.addEventListener("resize", function () {
        myChart.resize();
    });

})()

