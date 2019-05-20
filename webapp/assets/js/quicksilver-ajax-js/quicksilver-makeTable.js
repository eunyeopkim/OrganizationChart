//테이블렌더링-------------------------------------------------------------------------------
//테이블에부서이름뿌리기-적용x
var renderTableDepartmentName = function(departmentName,departmentNo){
	   $(".dept").empty();
	   let htmls = "<h6 class='m-0 font-weight-bold text-primary'>" + 
	   					departmentName + 
	   				"</h6>";
	   
	   $(".dept").append(htmls);
  
}
//테이블에팀장이름뿌리기-적용x
var renderLeader = function(leader){		
	   let htmlLeader = "<div class='m-0 font-weight-bold text-danger'>┖ 팀장 : "+ 
	   					leader.empName + "(" + leader.empSeq + ")"
					"</div>";			
	   $(".dept").append(htmlLeader);
}
let tableRender = function(vo){
	let htmls = 			"	<tr class=\"row\">\r\n" + 
	"								<td>"+vo.empSeq+"</td>\r\n"+
	"								<td>"+vo.deptSeq+"</td>\r\n"+
	"								<td>"+vo.deptName+"</td>\r\n" + 
	"								<td>"+vo.positionCode+"</td>\r\n" + 
	"								<td>"+vo.dutyCode+"</td>\r\n" + 
	"								<td>"+vo.empName+"("+ vo.loginId+")</td>\r\n" + 
	"								<td>"+vo.homeTelNum+"</td>\r\n" + 
	"								<td>"+vo.mobileTelNum+"</td>\r\n" + 
	"							</tr>"
	$(".member > tbody").append(htmls);	
}

//테이블그리기
var paging; 
var makeTable = function(url) {
	$(".member > tbody").empty();
	$.ajax({
		url: contextPath + url,
	      type:"get",
	      dataType:"json",
	      data:"",
	      async: false,
	      success: function(response){
	         $(response.data.list).each(function(index, vo){
	        	 tableRender(vo);
	         });
	         paging = response.data.page; 
	         pageRender(paging);
	      },
	      error: function(xhr, status, e){
	         console.error(status+":"+e);
	      }
	});
	//데이터테이블 버림
};
//팀장가져오기  - 적용x
var getLeader = function(url){
	$.ajax({
		url: contextPath + url + "/getLeader",
		type:"get",
		dataType:"json",
		data:"",
		success: function(response){						
			renderLeader(response.data)
		},
		error: function(xhr, status, e){
			console.error(status+":"+e);
		}
	});
}
//--------------------------------------------------------------------------

//페이징관련-------------------------------------------------------------------------
//페이지렌더링
let pageRender = function(paging){
	console.log(paging);
	
	$(".pagination").empty();																				 //페이징에 필요한 객체내부를 비워줌.
     //paging.pageNo != 1 
	if(paging.block != 0 && paging.totalBlock != 1){   													 //페이지가 1페이지 가아니면
        	$(".pagination").append("<li class=\"goFirstPage page-view\"><a>처음</a></li>");       			 //첫페이지로가는버튼 활성화
        }else{
        	$(".pagination").append("<li class=\"disabled page-view\"><a>처음</a></li>");       				 //첫페이지로가는버튼 비활성화
        }
	
    if(paging.block != 0){          																		 //첫번째 블럭이 아니면
        	$(".pagination").append("<li class=\"goBackPage page-view\"><a>이전</a></li>");      				 //뒤로가기버튼 활성화
    }else{
        	$(".pagination").append("<li class=\"disabled page-view\"><a>이전</a></li>");       				 //뒤로가기버튼 비활성화
    }
	 
    for(var i = paging.startPage ; i <= paging.endPage ; i++){        										 //시작페이지부터 종료페이지까지 반복문
    	if(paging.pageNo == i){                            													 //현재페이지가 반복중인 페이지와 같다면
            $(".pagination").append("<li class=\"active page-view\"><a>"+i+"</a></li>");    				 //버튼 비활성화
    	}else{
    		$(".pagination").append("<li class=\"goPage page-view\" data-page=\""+i+"\"><a>"+i+"</a></li>"); //버튼 활성화
    	}
    }
    
    if((paging.block+1) < paging.totalBlock){ 
		$(".pagination").append("<li class=\"page-view\"><a>...</a></li>"); 
		$(".pagination").append("<li class=\"goLastPage page-view\"><a>"+paging.totalPage+"</a></li>");
    }
    
    if(paging.block+1 < paging.totalBlock){           														 //전체페이지블럭수가 현재블럭수보다 작을때
    	$(".pagination").append("<li class=\"goNextPage page-view\"><a>다음</a></li>");        				 //다음페이지버튼 활성화
    }else{
    	$(".pagination").append("<li class=\"disabled page-view\"><a>다음</a></li>");     					 //다음페이지버튼 비활성화
    }
    //paging.pageNo < paging.totalPage
    if((paging.block+1) < paging.totalBlock && paging.totalBlock != 1){             						 //현재페이지가 전체페이지보다 작을때
		$(".pagination").append("<li class=\"goLastPage page-view\"><a>맨끝</a></li>");    					 //마지막페이지로 가기 버튼 활성화
	}else{
		$(".pagination").append("<li class=\"disabled page-view\"><a>맨끝</a></li>");        					 //마지막페이지로 가기 버튼 비활성화
	}
    
    
}

//검색과 부서클릭 구분 Flag
let pageFlageMakeTable = function(pageNo){
    if(pageFlag == 1){
    	makeTable("/boot/pagination?pageNo="+pageNo);		    	
    }else{
    	var seq = $("tbody > tr.row > td").get(1).innerHTML;		    	
    	makeTable("/getEmpInfo/" + seq + "/d?pageNo="+pageNo);	
    }
}

$(function(){
	  //페이지클릭 분기	
	  $(document).on("click", ".goFirstPage", function(event){
		    var pageNo = 1;
		    pageFlageMakeTable(pageNo);
	   });
	   $(document).on("click", ".goBackPage", function(event){
		    var pageNo = Number(paging.startPage) - 1;
		    pageFlageMakeTable(pageNo);
	   });
	   $(document).on("click", ".goPage", function(event){
			var pageNo = Number($(this).attr("data-page"));
			pageFlageMakeTable(pageNo);
	   });
	   $(document).on("click", ".goNextPage", function(event){	   
			var pageNo = Number(paging.endPage) + 1;
			pageFlageMakeTable(pageNo);
	   });
	   $(document).on("click", ".goLastPage", function(event){	
		   	var pageNo = paging.totalPage;
		   	pageFlageMakeTable(pageNo);
	   });	   
});