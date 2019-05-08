//부서뿌리기
//var render = function(vo){
//	var htmls = "<li class='departments dropdown-item' class='dept' data-no='"+vo.no+"' g-no='"+vo.gNo+"' p-no='"+vo.parents+"' depth='"+vo.depth+"' style='padding-left:"+vo.depth*10+"px'>"+vo.name+"</li>" +
//   			    "<ul data-no='"+vo.no+"'></ul>";
//
//	if(vo.parents > 0){
//		$("ul[data-no='"+vo.parents+"']").append(htmls);
//	}else{
//		$("ul[c-no='"+vo.companyNo+"']").append(htmls);
//	}
//}

var deptRender = function(vo){
	//console.log('여안옴??')
   var htmls = "<li class='departments dropdown-item' class='dept' data-no='"+vo.deptSeq+"' g-no='"+vo.groupSeq+"' p-no='"+vo.parentDeptSeq+"' depth='"+vo.deptLevel+"' style='padding-left:"+(vo.deptLevel+1)*10+"px'><span>"+vo.deptName+"<span></li><ul data-no='"+vo.deptSeq+"'></ul>";
   if(parseInt(vo.parentDeptSeq) < 10000000){
	  // console.log("사업장 바로 밑 부서가 아님")
	   $("ul[data-no='"+vo.parentDeptSeq+"']").append(htmls);
   }else{
	   /*console.log("사업장 바로 밑 부서")
	   console.log( $("ul[c-no=1]").children());*/
	   $('ul[b-no="' + vo.parentDeptSeq + '"]').append(htmls);
   }
   
//   $("li[data-no='"+vo.parentDeptSeq+"'] span").css("color","red"); //고치자
}

var bizRender = function(vo){
	var htmls = "<li class='biz dropdown-item' class='biz' data-no='"+vo.bizSeq+"' g-no='"+vo.groupSeq+"' p-no='"+vo.parents+"' style='padding-left:10px'><span>"+vo.bizName+"<span></li><ul b-no='"+vo.bizSeq+"'></ul>";
	$("ul[c-no='"+vo.compSeq+"']").append(htmls);
}

//테이블에부서이름뿌리기
var renderTableDepartmentName = function(departmentName,departmentNo){
	   $(".dept").empty();
	   let htmls = "<h6 class='m-0 font-weight-bold text-primary'>" + 
	   					departmentName + 
	   				"</h6>";
	   
	   $(".dept").append(htmls);
  
}
//테이블에팀장이름뿌리기
var renderLeader = function(leader){
		console.log(leader);
		console.log(leader.name);
		
	   let htmlLeader = "<div class='m-0 font-weight-bold text-danger'>┖ 팀장 : "+ 
	   					leader.empName + "(" + leader.empSeq + ")"
					"</div>";	
		
	   $(".dept").append(htmlLeader);
}

//부서리스트가져오기
//var getList = function(parents){
//	$.ajax({
//		url: contextPath + "/getDept/" + parents,
//		type:"get",
//		dataType:"json",
//		data:"",
//		success: function(response){
//			console.log(response);
//			$(response.data).each(function(index, vo){
//				render(vo)
//			});
//		},
//		error: function(xhr, status, e){
//			console.error(status+":"+e);
//		}
//	});
//}

var getList = function(seq){
	
	$.ajax({
      url: contextPath + "/getDept/"+seq,
      type:"get",
      dataType:"json",
      data:"",
      success: function(response){   	

//    	 let pickDepth=$("li[data-no='"+seq+"']").attr("depth");
    	 
    	 $(response.data).each(function(index, vo){
            deptRender(vo)
         });
    	 
    	 $("li[data-no!='"+seq+"']").css("color","black");
    	 $("li[data-no='"+seq+"']").css("color","red"); //고치자
//    	 $("li[data-no!='"+seq+"'][depth='"+ pickDepth +"']").css("color","black"); 
//    	 $("li[data-no!='"+seq+"'][depth='"+ (Number(pickDepth)+1) +"']").css("color","black"); 
      },
      error: function(xhr, status, e){
         console.error(status+"::"+e);
      }
      
   });
}
var getListSearch = function(seq, pseq){
	
	$.ajax({
      url: contextPath + "/getDept/"+seq,
      type:"get",
      dataType:"json",
      data:"",
      async: false,
      success: function(response){   	
    	 $(response.data).each(function(index, vo){
    		// console.log("부서렌더")
            deptRender(vo)
         });
    	 $("li[data-no!='"+pseq+"']").css("color","black");
    	 $("li[data-no='"+pseq+"']").css("color","red"); //고치자
      },
      error: function(xhr, status, e){
         console.error(status+":"+e);
      }
   });
}

var getBizList = function(seq){
	console.log(seq+"이건 seq입니다.")
	$.ajax({
		url: contextPath + "/getBiz/"+seq,
	      type:"get",
	      dataType:"json",
	      data:"",
	      async: false,
	      success: function(response){
	         $(response.data).each(function(index, vo){
	        	// console.log(response.data);
	            bizRender(vo)
	         });
	      },
	      error: function(xhr, status, e){
	         console.error(status+":"+e);
	      }
	});
}

//부서클릭시 테이블그리기
var makeTable = function(url) {	
	$("#dataTable").dataTable().fnDestroy();
	
	$('#dataTable').dataTable({
          pageLength: 5,
          bPaginate: true,
          bLengthChange: true,
          lengthMenu : [ [ 3, 5, 10, -1 ], [ 3, 5, 10, "All" ] ],
          bAutoWidth: false,
          processing: false,
          ordering: true,
          serverSide: false,
          searching: false,
          scrollY: 250,
          scrollCollapse: false,
         
          ajax : {
              "url": contextPath + url,
              "type": "GET",
              "data": '',
          },
          
          columns : [
              {data: "empNum"},
              {data: "empName"},
              {data: "bDay"},
              {data: "genderCode"},
              {data: "positionCode"},
              {data: "dutyCode"},              
              {data: "deptName"}
          ]
      });	
	
};
//팀장가져오기 
var getLeader = function(url){
	$.ajax({
		url: contextPath + url + "/getLeader",
		type:"get",
		dataType:"json",
		data:"",
		success: function(response){			
			console.log(response);
			console.log("아니오라고요 ...");
			
			renderLeader(response.data)
		},
		error: function(xhr, status, e){
			console.error(status+":"+e);
		}
	});
}


$(function(){
	$('#dataTable').dataTable();

	$(document).on("click", ".company", function(event){
		console.log("회사클릭")
	   var seq = $(this).attr("data-no");
	   if($(this).next().children().length > 0){
		   console.log("사업장 다지움");
		   $(this).next().children().remove();
	   }else{
		   getBizList(seq);
		   //그담코드는 bootstrap.bundle.js 안에 _proto.toggle = function toggle() { 4168번째줄이 계속실행됨 누를때마다
	   }
   });
   
   //사업장 목록
   $(document).on("click", ".biz", function(event){
	  var seq = $(this).attr("data-no");
	  if($(this).next().children().length > 0){
		  $(this).next().children().remove();
	  }else{
		   getList(seq);
		   
		   let departmentName = $(this).html();
		   makeTable("/getEmpInfo/" + seq + "/b");
		   renderTableDepartmentName(departmentName, seq);
	  }

   });
	
   //부서 목록
   $(document).on("click", ".departments", function(event){
	  var seq = $(this).attr("data-no");
	  if($(this).next().children().length > 0){
		  $(this).next().children().remove();
	  }else{
		  console.log(seq) 
		  getList(seq);
		  
		  let departmentName = $(this).html();
		  makeTable("/getEmpInfo/" + seq + "/d");
		  renderTableDepartmentName(departmentName, seq);
		  getLeader("/boot/getDepartmentEmployeeInfo/" + seq);
	  }
   });
});
