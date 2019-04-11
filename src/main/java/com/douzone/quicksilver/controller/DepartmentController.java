package com.douzone.quicksilver.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.douzone.dto.JSONResult;
import com.douzone.quicksilver.service.DepartmentService;
import com.douzone.quicksilver.vo.DeptManagerVo;
import com.douzone.quicksilver.vo.EmployeesVo;

@Controller
@RequestMapping("boot/getDepartmentEmployeeInfo")
public class DepartmentController {
	
	@Autowired
	private DepartmentService departmentService;
	
	// 부서 정보를 가져와서 테이블에 출력
	@ResponseBody
	@RequestMapping("/{dept_no}")
	public JSONResult getDepartmentEmployeeInfo(@PathVariable Long dept_no) {

			DeptManagerVo deptLeader = departmentService.getDepartmentEmployeeInfoLeader(dept_no);
			List<EmployeesVo> emplist =	departmentService.getDepartmentEmployeeInfo(dept_no);
			Map<Object, String> map = new HashMap<Object, String>();
			map.put(deptLeader,"deptLeader");
			map.put(emplist,"emplist");
			//미완성

		return JSONResult.success(departmentService.getDepartmentEmployeeInfo(dept_no));
	}
	
	@RequestMapping({"/addDepartment/{parentNo}/{departmentName}"})
	public void addDepartment(@PathVariable Long parentNo,
			 				  @PathVariable String departmentName) {		
		departmentService.addDepartment(parentNo, departmentName);
	}
	
	@RequestMapping({"/deleteDepartment/{departmentNo}"})
	public void deleteDepartment(@PathVariable Long departmentNo) {		
		departmentService.deleteDepartment(departmentNo);
	}
	
//	@RequestMapping({"/addDepartment/{parentNo}/{departmentName}"})
//	public void test(@PathVariable Long parentNo,
//			 @PathVariable String departmentName) {
//		if( parentNo < 0) {
//			 //자회사 바로 밑에 부서 10개씩 다 추가
//			for(long i = parentNo; i >= -10; i--)
//			{
//				System.out.println("여기");
//				for(int j = 1; j <= 10; j++) {
//					departmentService.addDepartment(i, "부서" + Math.abs(j));
//				}
//			}
//		}
//		else if( parentNo < 100) {
//			// 부서밑에 10개씩 다 추가
//			int index = 1;
//			for(long x = parentNo; x <= 100; x++) {
//				
//				for(int i = 1 + (10 * ( (int)x - 1) ); i <= 100; i++) {
//					for(int j = 1; j <= 10; j++) {
//						departmentService.addDepartment(i, "부서-" + index + "-" + j);
//						
//					}
//					
//					index++;
//					if( index > 10) {
//						index = 1;
//					}
//				}
//			}
//		}
//		else {
//			for(long x = parentNo; x <= 5600;) {
//				
//				for(int i = 1; i <= 10; i++) {
//					for(int j = 1; j <= 10; j++) {
//						for(int k = 1; k <= 1; k++) {
//							departmentService.addDepartment(x++, "부서-" + i + "-" + j + "-" + k);
//						}
//						
//					}
//				}
//			}
//		}
//	}
}
