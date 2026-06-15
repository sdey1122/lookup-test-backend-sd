const express = require("express");
const router = express.Router();
const AggregationController = require("../controllers/aggregationController");
const aggregationController = new AggregationController();

// data routes
router.post("/generate-data", aggregationController.generateDummyData);
router.post("/bulk-users", aggregationController.bulkInsertUsers);
router.get("/departments", aggregationController.getAllDepartments);
router.get("/users", aggregationController.getAllUsers);
router.get("/projects", aggregationController.getAllProjects);
router.get("/tasks", aggregationController.getAllTasks);

// aggregation routea
router.get("/q1", aggregationController.getUsersWithDepartment);
router.get("/q2", aggregationController.getUserCountByDepartment);
router.get("/q3", aggregationController.getDepartmentEmployeeCount);
router.get("/q4", aggregationController.getProjectsWithDepartment);
router.get("/q5", aggregationController.getTaskCountByUser);
router.get("/q6", aggregationController.getDepartmentSalaryExpense);
router.get("/q7", aggregationController.getDepartmentActiveProjects);
router.get("/q8", aggregationController.getCompletedTaskCountByUser);
router.get("/q9", aggregationController.getTop3UsersCompletedTasks);
router.get("/q10", aggregationController.getTotalHoursByProject);
router.get("/q11", aggregationController.getDepartmentSummary);
router.get("/q12", aggregationController.getUsersWithoutTasks);
router.get("/q13", aggregationController.getHighestSalaryDepartment);
router.get("/q14", aggregationController.getProjectTaskReport);
router.get("/q15", aggregationController.getMonthlyRegistrations);
router.get("/q16", aggregationController.getUserTotalHoursWorked);
router.get("/q17", aggregationController.getDepartmentsWithHighAverageSalary);
router.get("/q18", aggregationController.getProjectEfficiencyReport);
router.get("/q19", aggregationController.getUsersWorkingOnMultipleProjects);
router.get("/q20", aggregationController.getAdminDashboard);

module.exports = router;
