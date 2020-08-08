angular.module('dashboardControllers', ['blooddonationServices'])
.controller('dashboardCtrl', function(Blooddonation,Bloodrequest,$scope, $route,$location,$http) {
var app = this;


function getChart() {

    Blooddonation.getChart1().then(function(data) {
        //console.log(1, data.data.date);
        app.date = data.data.date; 
        initChart();      
    });

    Bloodrequest.getChartclaimed().then(function(data) {
        console.log(1, data.data.date2);
        app.date2 = data.data.date2; 
        initChart();      
    });
}


function getChart2() {

    Blooddonation.getChart2().then(function(data) {
        app.branch = data.data.branch;      
        initChart2();   
    });
}

function getChart3() {

    Blooddonation.getChart3().then(function(data) {
        app.deferral = data.data.deferral;      
        initChart3();   
    });
}

function getChart4() {

    Blooddonation.getChart4().then(function(data) {
        app.date = data.data.date;   
        initChart4();   
    });
    Blooddonation.getChart5().then(function(data) {
        app.date2 = data.data.date2;  
        initChart4();       
    });

    Blooddonation.getChart6().then(function(data) {
        app.date3 = data.data.date3;  
        initChart4();       
    });

    Blooddonation.getChart7().then(function(data) {
        app.date4 = data.data.date4;  
        initChart4();       
    });

    Blooddonation.getChart8().then(function(data) {
        app.date5 = data.data.date5;  
        initChart4();       
    });

    Blooddonation.getChart9().then(function(data) {
        app.date6 = data.data.date6;  
        initChart4();       
    });
}




function initChart() {
    var data_series = [];
    //console.log(2, app.date);
    
    for(let key in app.date) {
        data_series.push({
            "date": app.date[key]._id,
            "value": app.date[key].count
        });
    }

    for(let key2 in app.date2) {
        data_series.push({
            "date2": app.date2[key2]._id,
            "value2": app.date2[key2].count2
        });
    }
    
// Themes begin
am4core.useTheme(am4themes_dataviz);
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
var chart = am4core.create("chartdiv1", am4charts.XYChart);
// Create axes
var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.grid.template.location = 0;
dateAxis.renderer.minGridDistance = 50;

chart.scrollbarX = new am4charts.XYChartScrollbar();


var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
var series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueY = "value";
series.dataFields.dateX = "date";
series.strokeWidth = 1;
series.fillOpacity = 0.5;
series.name = 'Blood Donation'
series.tooltipText = "Blood Donation{date}: [bold]{valueY}[/]";

series.legendSettings.labelText = "Series: [bold {stroke}]{name}[/]";
series.legendSettings.valueText = "{valueY.close}";
series.legendSettings.itemValueText = " {date}:[bold]{valueY}[/bold]";

var series2 = chart.series.push(new am4charts.LineSeries());
series2.dataFields.valueY = "value2";
series2.dataFields.dateX = "date2";
series2.strokeWidth = 1;
series2.fillOpacity = 0.5;
series2.name = 'Blood Claimed'
series2.tooltipText = "Blood Claimed {date2}: [bold]{valueY}[/]";

series2.legendSettings.labelText = "Series: [bold {stroke}]{name}[/]";
series2.legendSettings.valueText = "{valueY.close}";
series2.legendSettings.itemValueText = " {date2}:[bold]{valueY}[/bold]";


// Add vertical scrollbar
chart.scrollbarY = new am4core.Scrollbar();
chart.scrollbarY.marginLeft = 0;
// Add cursor
chart.cursor = new am4charts.XYCursor();
chart.cursor.behavior = "zoomY";
chart.cursor.lineX.disabled = true;

chart.data = data_series;
// Enable export
chart.exporting.menu = new am4core.ExportMenu();
chart.exporting.menu.align = "left";
chart.exporting.menu.verticalAlign = "top";

/* Add legend */
chart.legend = new am4charts.Legend();
chart.legend.labels.template.text = "Series: [bold {stroke}]{name}[/]";

// Add horizotal scrollbar with preview
var scrollbarX = new am4charts.XYChartScrollbar();
scrollbarX.series.push(series);
chart.scrollbarX = scrollbarX;
chart.scrollbarX.parent = chart.bottomAxesContainer;


chart.events.on("ready", function () {
  dateAxis.zoom({start:0.3, end:1.1});
});
}



function initChart2() {
    var data_series = [];

    for(let key in app.branch) {
        data_series.push({
            "country": app.branch[key]._id,
            "litres": app.branch[key].count
        });
    }
    
    am4core.useTheme(am4themes_animated);


var chart = am4core.create("chartdiv2", am4charts.PieChart3D);
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in


chart.data = data_series;
chart.innerRadius = am4core.percent(40);
chart.depth = 120;

chart.legend = new am4charts.Legend();

var series = chart.series.push(new am4charts.PieSeries3D());
series.dataFields.value = "litres";
series.dataFields.depthValue = "litres";
series.dataFields.category = "country";
series.slices.template.cornerRadius = 5;
series.colors.step = 3;

// Enable export
chart.exporting.menu = new am4core.ExportMenu();
chart.exporting.menu.align = "right";
chart.exporting.menu.verticalAlign = "top";
}



function initChart3() {
    var chart;

    var data_series = [];

    for(let key in app.deferral) {
        data_series.push({
            "name": app.deferral[key]._id,
            "steps": app.deferral[key].count
        });
    }
    am4core.useTheme(am4themes_dataviz);
    am4core.useTheme(am4themes_animated);

    var chart = am4core.create("chartdiv", am4charts.XYChart);
    
    
    chart.paddingBottom = 10;
    
    chart.data = data_series;
    
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "name";
    categoryAxis.renderer.grid.template.strokeOpacity = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.labels.template.dy = 35;
    categoryAxis.renderer.tooltip.dy = 35;
    
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.fillOpacity = 1.3;
    valueAxis.renderer.grid.template.strokeOpacity = 0.4;
    valueAxis.min = 0;
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.renderer.baseGrid.strokeOpacity = 0;
    
    var series = chart.series.push(new am4charts.ColumnSeries);
    series.dataFields.valueY = "steps";
    series.dataFields.categoryX = "name";
    series.tooltipText = "{valueY.value}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.dy = - 6;
    series.columnsContainer.zIndex = 100;


    var columnTemplate = series.columns.template;
    columnTemplate.width = am4core.percent(50);
    columnTemplate.maxWidth = 56;
    columnTemplate.column.cornerRadius(10, 10, 10, 10);
    columnTemplate.strokeOpacity = 0;
    
    series.heatRules.push({ target: columnTemplate, property: "fill", dataField: "valueY", min: am4core.color("#C9463D"), max: am4core.color("#962E40") });
    series.mainContainer.mask = undefined;
    
    var cursor = new am4charts.XYCursor();
    chart.cursor = cursor;
    cursor.lineX.disabled = true;
    cursor.lineY.disabled = true;
    cursor.behavior = "none";
    
    var bullet = columnTemplate.createChild(am4charts.CircleBullet);
    bullet.circle.radius = 20;
    bullet.valign = "bottom";
    bullet.align = "center";
    bullet.isMeasured = true;
    bullet.interactionsEnabled = false;
    bullet.verticalCenter = "bottom";
    
    var hoverState = bullet.states.create("hover");
    
    var outlineCircle = bullet.createChild(am4core.Circle);
    outlineCircle.adapter.add("radius", function (radius, target) {
        var circleBullet = target.parent;
        return circleBullet.circle.pixelRadius + 10;
    })
    
    var image = bullet.createChild(am4core.Image);
    image.width = 20;
    image.height = 20;
    image.horizontalCenter = "middle";
    image.verticalCenter = "middle";
    
    image.adapter.add("superadmin", function (href, target) {
        var dataItem = target.dataItem;
        if (dataItem) {
            return dataItem.categoryX.toLowerCase() + ".jpg";
        }
    })
    
    
    image.adapter.add("mask", function (mask, target) {
        var circleBullet = target.parent;
        return circleBullet.circle;
    })
    
    var previousBullet;
    chart.cursor.events.on("cursorpositionchanged", function (event) {
        var dataItem = series.tooltipDataItem;
    
        if (dataItem.column) {
            var bullet = dataItem.column.children.getIndex(1);
    
            if (previousBullet && previousBullet != bullet) {
                previousBullet.isHover = false;
            }
    
            if (previousBullet != bullet) {
    
                var hs = bullet.states.getKey("hover");
                hs.properties.dy = -bullet.parent.pixelHeight + 30;
                bullet.isHover = true;
    
                previousBullet = bullet;
            }
        }
    })
}



function initChart4() {
   /**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 * 
 * For more information visit:
 * https://www.amcharts.com/
 * 
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */

// Themes begin
am4core.useTheme(am4themes_material);
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
var chart = am4core.create("chartdiv4", am4charts.XYChart);

    var data_series = [];


    for(let key in app.date) {
        data_series.push({
            "date2": app.date[key]._id,
            "value2": app.date[key].count
        });
    }

    for(let key2 in app.date2) {
        data_series.push({
            "date": app.date2[key2]._id,
            "value": app.date2[key2].count2
        });
    }

    for(let key3 in app.date3) {
        data_series.push({
       
            "date3": app.date3[key3]._id,
            "value3": app.date3[key3].count3
        });
    }

    for(let key4 in app.date4) {
        data_series.push({
       
            "date4": app.date4[key4]._id,
            "value4": app.date4[key4].count4
        });
    }

    for(let key5 in app.date5) {
        data_series.push({
       
            "date5": app.date5[key5]._id,
            "value5": app.date5[key5].count5
        });
    }

    for(let key6 in app.date6) {
        data_series.push({
       
            "date6": app.date6[key6]._id,
            "value6": app.date6[key6].count6
        });
    }

    chart.data = data_series;
    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    
    // Create series
    

    
    // Create series
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.tooltipText = "{value2}"
    series.strokeWidth = 2;
    series.minBulletDistance = 15;
    
    // Drop-shaped tooltips
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.strokeOpacity = 0;
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.label.minWidth = 40;
    series.tooltip.label.minHeight = 40;
    series.tooltip.label.textAlign = "middle";
    series.tooltip.label.textValign = "middle";
    series.bullets.push(new am4charts.CircleBullet());
    series.tooltipText = "Overall Donation in Mandaluyong: {valueY}";
    series.legendSettings.valueText = "{valueY}";
    series.legendSettings.labelText = "Mandaluyong: [bold {stroke}]{name}[/]";
    series.legendSettings.itemValueText = " {date}:[bold]{valueY}[/bold]";


     // Create series
     var series2 = chart.series.push(new am4charts.LineSeries());
     series2.dataFields.valueY = "value2";
     series2.dataFields.dateX = "date2";
     series2.tooltipText = "{value2}"
     series2.strokeWidth = 2;
     series2.minBulletDistance = 15;
     
     // Drop-shaped tooltips
     series2.tooltip.background.cornerRadius = 20;
     series2.tooltip.background.strokeOpacity = 0;
     series2.tooltip.pointerOrientation = "vertical";
     series2.tooltip.label.minWidth = 40;
     series2.tooltip.label.minHeight = 40;
     series2.tooltip.label.textAlign = "middle";
     series2.tooltip.label.textValign = "middle";
     series2.bullets.push(new am4charts.CircleBullet());
     series2.tooltipText = "Overall Donation in Pasay: {valueY}";
     series2.legendSettings.valueText = "{valueY}";
     series2.legendSettings.labelText = "Pasay: [bold {stroke}]{name}[/]";
     series2.legendSettings.itemValueText = " {date2}:[bold]{valueY}[/bold]";

     

    
    // Create series
    var series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.valueY = "value3";
    series3.dataFields.dateX = "date3";
    series3.tooltipText = "{value3}"
    series3.strokeWidth = 2;
    series3.minBulletDistance = 15;
    
    // Drop-shaped tooltips
    series3.tooltip.background.cornerRadius = 20;
    series3.tooltip.background.strokeOpacity = 0;
    series3.tooltip.pointerOrientation = "vertical";
    series3.tooltip.label.minWidth = 40;
    series3.tooltip.label.minHeight = 40;
    series3.tooltip.label.textAlign = "middle";
    series3.tooltip.label.textValign = "middle";
    series3.bullets.push(new am4charts.CircleBullet());
    series3.tooltipText = "Overall Donation in Mandaluyong: {valueY}";
    series3.legendSettings.valueText = "{valueY}";
    series3.legendSettings.labelText = "Rizal: [bold {stroke}]{name}[/]";
    series3.legendSettings.itemValueText = " {date3}:[bold]{valueY}[/bold]";

    // Create series
    var series4 = chart.series.push(new am4charts.LineSeries());
    series4.dataFields.valueY = "value4";
    series4.dataFields.dateX = "date4";
    series4.tooltipText = "{value4}"
    series4.strokeWidth = 2;
    series4.minBulletDistance = 15;
    
    // Drop-shaped tooltips
    series4.tooltip.background.cornerRadius = 20;
    series4.tooltip.background.strokeOpacity = 0;
    series4.tooltip.pointerOrientation = "vertical";
    series4.tooltip.label.minWidth = 40;
    series4.tooltip.label.minHeight = 40;
    series4.tooltip.label.textAlign = "middle";
    series4.tooltip.label.textValign = "middle";
    series4.bullets.push(new am4charts.CircleBullet());
    series4.tooltipText = "Overall Donation in Caloocan: {valueY}";
    series4.legendSettings.valueText = "{valueY}";
    series4.legendSettings.labelText = "Caloocan: [bold {stroke}]{name}[/]";
    series4.legendSettings.itemValueText = " {date4}:[bold]{valueY}[/bold]";

    // Create series
    var series5 = chart.series.push(new am4charts.LineSeries());
    series5.dataFields.valueY = "value5";
    series5.dataFields.dateX = "date5";
    series5.tooltipText = "{value5}"
    series5.strokeWidth = 2;
    series5.minBulletDistance = 15;

    // Drop-shaped tooltips
    series5.tooltip.background.cornerRadius = 20;
    series5.tooltip.background.strokeOpacity = 0;
    series5.tooltip.pointerOrientation = "vertical";
    series5.tooltip.label.minWidth = 40;
    series5.tooltip.label.minHeight = 40;
    series5.tooltip.label.textAlign = "middle";
    series5.tooltip.label.textValign = "middle";
    series5.bullets.push(new am4charts.CircleBullet());
    series5.tooltipText = "Overall Donation in Manila: {valueY}";
    series5.legendSettings.valueText = "{valueY}";
    series5.legendSettings.labelText = "Manila: [bold {stroke}]{name}[/]";
    series5.legendSettings.itemValueText = " {date5}:[bold]{valueY}[/bold]";

    // Create series
    var series6 = chart.series.push(new am4charts.LineSeries());
    series6.dataFields.valueY = "value6";
    series6.dataFields.dateX = "date6";
    series6.tooltipText = "{value6}"
    series6.strokeWidth = 2;
    series6.minBulletDistance = 15;

    // Drop-shaped tooltips
    series6.tooltip.background.cornerRadius = 20;
    series6.tooltip.background.strokeOpacity = 0;
    series6.tooltip.pointerOrientation = "vertical";
    series6.tooltip.label.minWidth = 40;
    series6.tooltip.label.minHeight = 40;
    series6.tooltip.label.textAlign = "middle";
    series6.tooltip.label.textValign = "middle";
    series6.bullets.push(new am4charts.CircleBullet());
    series6.tooltipText = "Overall Donation in Quezon: {valueY}";
    series6.legendSettings.valueText = "{valueY}";
    series6.legendSettings.labelText = "Quezon: [bold {stroke}]{name}[/]";
    series6.legendSettings.itemValueText = " {date6}:[bold]{valueY}[/bold]";




    
    
    // Make bullets grow on hover
    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 1;
    bullet.circle.fill = am4core.color("#fff");
    
    var bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 1.3;
    
    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panXY";
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;
    chart.cursor.snapToSeries = series3;
    // Create vertical scrollbar and place it before the value axis
    chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarY.parent = chart.leftAxesContainer;
    chart.scrollbarY.toBack();
    
    // Create a horizontal scrollbar with previe and place it underneath the date axis
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX.series.push(series);
    chart.scrollbarX.series.push(series3);
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    
    chart.events.on("ready", function () {
      dateAxis.zoom({start:0.2, end:1});
    });
    
    
    /* Add legend */
    chart.legend = new am4charts.Legend();
    
    // Enable export
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.align = "left";
    chart.exporting.menu.verticalAlign = "top"; 
    chart.scrollbarY = new am4core.Scrollbar();
    
    
    // Add horizotal scrollbar with preview
    var scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX = new am4core.Scrollbar();
    scrollbarX.series.push(series);

    chart.scrollbarX = scrollbarX;
    chart.scrollbarX.parent = chart.bottomAxesContainer;
}



    getChart();
    getChart2();
    getChart3();
    getChart4();
 });

