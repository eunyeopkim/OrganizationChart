<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<link
	href="${pageContext.servletContext.contextPath }/assets/css/admin.css"
	rel="stylesheet" type="text/css">
<link rel="stylesheet" type="text/css" href="${pageContext.servletContext.contextPath }/assets/css/rankPositionManagement.css" />

<script type="text/javascript"
	src="${pageContext.request.contextPath }/assets/js/jquery/jquery-1.9.0.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath }/assets/js/admin/admin.js"></script>
<script src="http://dmaps.daum.net/map_js_init/postcode.v2.js"></script>
<style type="text/css">
td, th{ padding: 0;}
textarea{resize: none;}
div#contents div#content-table-wrapper {float: right; width:80%;}

div.content-head-wrapper {margin: 5px 5px; width: 100%; height: 20px;}
div.content-head-wrapper span {font-weight: bold;}
div.content-head-wrapper div.head-btn{ float: right; display: inline; border: 1px black solid; margin: 0 5px; padding: 0 10px;}
div.content-head-wrapper div.head-btn:hover{ cursor: pointer;}

div#contents table#company-content-table  {border-collapse:collapse; border-spacing:0;   background-color: white; width: 100%;}
div#contents table#company-content-table td{font-family:Arial, sans-serif;font-size:12px;border-style:solid;border-width:1px;overflow:hidden; word-break:normal;border-color:black; height: 24px;}
div#contents table#company-content-table th{font-family:Arial, sans-serif;font-size:12px;font-weight:normal;border-style:solid;border-width:1px; overflow:hidden; border-color:black; }
div#contents table#company-content-table .tg-9anz{border-color:#333333;text-align:right;}
div#contents table#company-content-table .tg-dvpl{border-color:inherit;text-align:right; background-color: #f9f9f9; padding-right: 10px;}
div#contents table#company-content-table .tg-de2y{border-color:inherit;text-align:left; padding: 5px 5px; background-color: white;}
div#contents table#company-content-table .tg-0pky{border-color:inherit;text-align:left;}
div#contents table#company-content-table .tg-cont{border-color:inherit;text-align:center; padding: 5px 5px; background-color: white;}
div#contents table#company-content-table input[type='text']{height: 18px; width: 99%; display: none;}
div#contents table#company-content-table th div{float: right;}
div#contents table#company-content-table input[name='zipCode'] { width: 100px; float: left;}
div#contents table#company-content-table div#zip-btn {float:left; width: 50px; height:18px; border: 1px black solid; margin: 0 5px; padding: 0 10px; cursor: pointer;}
div#contents table#company-content-table .update-unit {display: none;}
div#contents table#company-content-table select {width: 80%;}

</style>
<script type="text/javascript">
var contextPath = "${pageContext.servletContext.contextPath }";

function postcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if(data.userSelectedType === 'R'){
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if(data.buildingName !== '' && data.apartment === 'Y'){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if(extraAddr !== ''){
                    extraAddr = ' (' + extraAddr + ')';
                }
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            $("input[name='zipCode']").val(data.zonecode);
            $("input[name='addr']").val(addr + extraAddr);
            // 커서를 상세주소 필드로 이동한다.
            $("input[name='detailAddr']").focus();
        }
    }).open();
}

var compRender = function(vo){
	var htmls = "<tr><td>"+vo.compSeq+"</td><td>"+vo.compName+"</td></tr>";
	$("#company-table tbody").append(htmls);
	$("#company-table tbody tr:last").addClass("company-table-active");
	
	removeForm();
}

var getCompInfo = function(compSeq){
	$.ajax({
		url : contextPath + "/admin/getCompInfo/" + compSeq,
		type : "get",
		dataType : "json",
		data : "",
		success : function(response) {
			$("input,option").prop("checked",false);
			$("#company-content-table td span").each(function(index, item){
				for(var key in response.data){
					if($(item).attr('id') == key){
						if(response.data[key] == null) {
							response.data[key] = "";
						}
						if(($("#company-update-btn").css("display") == "none") &&
								($("#company-table tbody tr.company-table-active").length != 0)){
							$(item).next().val(response.data[key]);
							if(key == 'useYn'){
								$("input[data-id='"+response.data[key]+"']").prop("checked",true);
							}
							if(key == 'nativeLangCode'){
								$("option[data-id='"+response.data[key]+"']").prop("selected",true);
							}
						}else{
							$(item).text(response.data[key]);
							$(".update-unit").hide();
						}
					}
				}
			});
		},
		error : function(xhr, status, e) {
			console.error(status + ":" + e);
		}

	});
}

var deleteComp = function(){
	var formData = $("#company-form").serialize();
	$.ajax({
		url : contextPath + "/admin/deleteComp",
		type : "post",
		dataType : "json",
		data : formData,
		success : function(response) {
			console.log("삭제성공");
		},
		error : function(xhr, status, e) {
			console.error(status + ":" + e);
		}

	});
}

var addComp = function(){
	var formData = $("#company-form").serialize();
	$.ajax({
		url : contextPath + "/admin/addComp",
		type : "post",
		dataType : "json",
		data : formData,
		success : function(response) {
			compRender(response.data);
		},
		error : function(xhr, status, e) {
			console.error(status + ":" + e);
		}

	});
}

var updateComp = function(){
	var formData = $("#company-form").serialize();
	$.ajax({
		url : contextPath + "/admin/updateComp",
		type : "post",
		dataType : "json",
		data : formData,
		success : function(response) {
			console.log(response.data);
		},
		error : function(xhr, status, e) {
			console.error(status + ":" + e);
		}
	});
}

var updateForm = function(){
	$("#update-cancel-btn").show();
	$("#update-save-btn").show();
	$("#company-update-btn").hide();
	$(".update-unit").show();
	$("#company-content-table span").each(function(index, item){
		$(item).next().val($(item).text());
		if($(this).attr("id") == "useYn"){
			$("input[data-id='"+$(this).text()+"']").prop("checked",true);
		}
		if($(this).attr("id") == "nativeLangCode"){
			console.log($(this).text());
			$("option[data-id='"+$(this).text()+"']").prop("selected",true);
		}
		$(item).hide();
	});
	$("#company-content-table input[type='text']").show();
}

var removeForm = function(){
	$("#update-cancel-btn").hide();
	$("#update-save-btn").hide();
	$("#company-update-btn").show();
	$(".update-unit").hide();
	
	$("#company-content-table input[type='text']").each(function(index, item){
		$(item).prev().text($(item).val());
	});
	$("input:checked").parent().prev().text($("input:checked").attr("data-id"));
	$("option:checked").parent().prev().text($("option:checked").attr("data-id"));

	$("#company-content-table span").show();
	$("#company-content-table input[type='text']").hide();
}

$(function(){
	
});
</script>
</head>

<body>
		<header>
			<c:import url="/WEB-INF/views/admin/includes/header.jsp" />
		</header>
		
		<div class="section">
			<div>
				<c:import url="/WEB-INF/views/admin/includes/navigation.jsp" />
			</div>	
			
			<div class="mainSection" style="background-color:green;">
				
				<div class="topSearchDiv" style="background-color:lightGray;">
				
					<form>
					
						<span>회사선택</span>
						<select class="selectBoxStyle">
							<c:forEach items="${compList}" var="vo">
								<option value="${vo.compName }" data-compSeq="${vo.compSeq }">${vo.compName }</option>
							</c:forEach>
						</select>
						
						<span>직급/직책</span>
						<input class="inputText" name="position" type="text">
						
						<span>사용여부</span>
						<select>
						  <option value="사용">사용</option>
						  <option value="사용안함">사용안함</option>
						 
						</select>
						
						<input type="submit" value="검색">
						
					</form>
				</div>
				
				<div class="mainDiv" style="background-color:lightBlue;">
				
					<div class="listDiv" style="background-color: pink;">
						<table border="1px;">
							<thead>
								<tr>
									<th>코드</th>
									<th id="nickName">명칭</th>
									<th>사용회사</th>
									<th id="useCheck">사용여부</th>
								</tr>
							</thead>
						</table>
					</div>
					
					<div class="positionInfoDiv" style="background-color: lightYellow;">
						<p class="positionInfoLabel">●직급정보</p>
						
						<div class="positionInfoForm">
								<table class="tg" style="undefined;table-layout: fixed;">
								<colgroup>
									<col style="width: 35px">
									<col style="width: 50px">
									<col style="width: 148px">
								</colgroup>
								  <tr>
								    <th class="tg-dvpl" colspan="2">회사선택</th>
								    <th class="tg-0lax">
								    	<select>
										  <option value="volvo">Volvo</option>
										  <option value="saab">Saab</option>
										  <option value="mercedes">Mercedes</option>
										  <option value="audi">Audi</option>
										</select>
								    </th>
								  </tr>
								  <tr>
								    <td class="tg-lqy6" colspan="2">코드</td>
								    <td class="tg-0lax">
								    	<input class="inputText" type="text">
								   
								    </td>
								  </tr>
								  <tr>
								    <td class="tg-baqh" rowspan="4">명칭</td>
								    
								    <td class="tg-lqy6">한국어</td>
								    <td class="tg-0lax">
								   		 <input class="inputText" type="text">
								    </td>
								  </tr>
								  <tr>
								    <td class="tg-lqy6">영어</td>
								    <td class="tg-0lax">
								    	<input class="inputText" type="text">
								    </td>
								  </tr>
								  <tr>
								    <td class="tg-lqy6">일본어</td>
								    <td class="tg-0lax">
								    	<input class="inputText" type="text">
								    </td>
								  </tr>
								  <tr>
								    <td class="tg-lqy6">중국어</td>
								    <td class="tg-0lax">
								    	<input class="inputText" type="text">
								    </td>
								  </tr>
								  <tr>
								    <td class="tg-lqy6" colspan="2">사용여부</td>
								    <td class="tg-0lax"></td>
								  </tr>
								  <tr>
								    <td class="tg-lqy6" colspan="2">정렬순서</td>
								    <td class="tg-0lax2">
								    	<input type="text">
								    </td>
								  </tr>
								  <tr>
								    <td class="tg-lqy6" colspan="2">비고</td>
								    <td class="tg-0lax2">
								    	<input type="text">
								    </td>
								  </tr>
								</table>
						</div>
					</div>
					
				</div>
			</div>
		</div>
			
			
		<footer>
			<c:import url="/WEB-INF/views/admin/includes/footer.jsp" />
		
		</footer>
</body>
</html>