let labelsArray = new Array();
let compEmpCountArray = new Array();
let myLineChart;

let InfoBar = function(seq){

	labelsArray = [];
	compEmpCountArray = [];
	
	if(seq){
		$.ajax({
			url: contextPath + "/getBizChart/"+seq,
			type:"get",
			dataType:"json",
			data:"",
			async: false,
			success: function(response){
				console.log(response.data);
				$(response.data).each(function(index, vo){
					labelsArray.push(vo.bizName);
					compEmpCountArray.push(vo.bizEmpCount);
					
					$(".card-header .fa-chart-bar").html("사업장별 직원 수")
				});
				
			},
			error: function(xhr, status, e){
				console.error(status+":"+e);
			}
		});
	}else{	
		$.ajax({
			url: contextPath + "/getMainChart",
			type:"get",
			dataType:"json",
			data:"",
			async: false,
			success: function(response){
				console.log(response.data);
				$(response.data).each(function(index, vo){
					labelsArray.push(vo.compName);
					compEmpCountArray.push(vo.compEmpCount);
				});
				$(".card-header .fa-chart-bar").html("자회사별 직원 수")
			},
			error: function(xhr, status, e){
				console.error(status+":"+e);
			}
		});
	}
	//캔버스 hover방지
	if(myLineChart != null){
		resetCanvasBar();		
	}
	//각 유형별 최댓값으로 유동적인 max값으로 차트를 보기편하게함
	let maxData = Math.max.apply(null, compEmpCountArray);
	
	// Set new default font family and font color to mimic Bootstrap's default styling
	Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
	Chart.defaults.global.defaultFontColor = '#292b2c';
	
	// Bar Chart Example
	var ctx = document.getElementById("myBarChart");
	myLineChart = new Chart(ctx, {
	  type: 'bar',
	  data: {
	    labels: labelsArray,
	    datasets: [{
	      label: "직원 수(명)",
	      backgroundColor: "#EFF6FE",
	      borderColor: "rgba(2,117,216,1)",
	      borderWidth: 1,
	      data: compEmpCountArray,
	    }],
	  },
	  options: {   
		  
        animation: {
            onProgress: function(animation) {
            }
        },
	    scales: {
	      xAxes: [{
	        time: {
//	          unit: 'month'
	        },
	        gridLines: {
	          display: true
	        },
	        ticks: {
	          autoSkip: false
	        }
	      }],
	      yAxes: [{
	        ticks: {
	          min: 0,
	          max: maxData + (maxData/7),
	          maxTicksLimit: 5
	        },
	        gridLines: {
	          display: true
	        }
	      }],
	    },
	    legend: {
	      display: false
	    },
	  	 plugins:{
	  		 labels: {
	  			render: 'value'
	  		 }
	  	  },
	  }
	});
}

var resetCanvasBar = function(){
	  $('#myBarChart').remove(); // this is my <canvas> element
	  $('#graph-container-bar').append('<canvas id="myBarChart" width="100%" height="60"><canvas>');
	  canvas = document.querySelector('#myBarChart');
	  ctx = canvas.getContext('2d');
	  console.log(ctx);
	  var x = canvas.width/2;
	  var y = canvas.height/2;
};

$(function(){
	InfoBar();
});
