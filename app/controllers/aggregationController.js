const User = require("../models/User");
const Department = require("../models/Department");
const Project = require("../models/Project");
const Task = require("../models/Task");

class AggregationController {
  //q1
  async getUsersWithDepartment(req, res) {
    try {
      const users = await User.aggregate([
        {
          $lookup: {
            from: "departments",
            localField: "departmentId",
            foreignField: "_id",
            as: "department",
          },
        },
      ]);

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q2
  async getUserCountByDepartment(req, res) {
    try {
      const result = await User.aggregate([
        {
          $group: {
            _id: "$departmentId",
            departmentName: {
              $first: "$department.name",
            },
            totalUsers: {
              $sum: 1,
            },
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q3
  async getDepartmentEmployeeCount(req, res) {
    try {
      const result = await User.aggregate([
        {
          $group: {
            _id: "$departmentId",
            totalEmployees: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: "departments",
            localField: "_id",
            foreignField: "_id",
            as: "department",
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q4
  async getProjectsWithDepartment(req, res) {
    try {
      const result = await Project.aggregate([
        {
          $lookup: {
            from: "departments",
            localField: "departmentId",
            foreignField: "_id",
            as: "department",
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q5
  async getTaskCountByUser(req, res) {
    try {
      const result = await Task.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "assignedTo",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $group: {
            _id: "$assignedTo",
            userName: {
              $first: "$user.name",
            },
            totalTasks: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            userId: "$_id",
            userName: 1,
            totalTasks: 1,
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q6
  async getDepartmentSalaryExpense(req, res) {
    try {
      const result = await User.aggregate([
        {
          $lookup: {
            from: "departments",
            localField: "departmentId",
            foreignField: "_id",
            as: "department",
          },
        },
        {
          $unwind: "$department",
        },
        {
          $group: {
            _id: "$departmentId",
            departmentName: {
              $first: "$department.name",
            },
            totalSalaryExpense: {
              $sum: "$salary",
            },
            users: {
              $push: {
                userId: "$_id",
                userName: "$name",
                salary: "$salary",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            departmentId: "$_id",
            departmentName: 1,
            totalSalaryExpense: 1,
            users: 1,
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q7
  async getDepartmentActiveProjects(req, res) {
    try {
      const result = await Project.aggregate([
        {
          $match: {
            status: "active",
          },
        },
        {
          $lookup: {
            from: "departments",
            localField: "departmentId",
            foreignField: "_id",
            as: "department",
          },
        },
        {
          $unwind: "$department",
        },
        {
          $group: {
            _id: "$departmentId",
            departmentName: {
              $first: "$department.name",
            },
            activeProjects: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            departmentId: "$_id",
            departmentName: 1,
            activeProjects: 1,
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q8
  async getCompletedTaskCountByUser(req, res) {
    try {
      const result = await Task.aggregate([
        {
          $match: {
            status: "completed",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "assignedTo",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $group: {
            _id: "$assignedTo",
            userName: {
              $first: "$user.name",
            },
            completedTasks: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            userId: "$_id",
            userName: 1,
            completedTasks: 1,
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q9
  async getTop3UsersCompletedTasks(req, res) {
    try {
      const result = await Task.aggregate([
        {
          $match: {
            status: "completed",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "assignedTo",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $group: {
            _id: "$assignedTo",
            userName: {
              $first: "$user.name",
            },
            completedTasks: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            completedTasks: -1,
          },
        },
        {
          $limit: 3,
        },
        {
          $project: {
            _id: 0,
            userId: "$_id",
            userName: 1,
            completedTasks: 1,
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q10
  async getTotalHoursByProject(req, res) {
    try {
      const result = await Task.aggregate([
        {
          $lookup: {
            from: "projects",
            localField: "projectId",
            foreignField: "_id",
            as: "project",
          },
        },
        {
          $unwind: "$project",
        },
        {
          $group: {
            _id: "$projectId",
            projectName: {
              $first: "$project.name",
            },
            totalHoursWorked: {
              $sum: "$hoursWorked",
            },
          },
        },
        {
          $project: {
            _id: 0,
            projectId: "$_id",
            projectName: 1,
            totalHoursWorked: 1,
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q11
  async getDepartmentSummary(req, res) {
    try {
      const result = await Department.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "departmentId",
            as: "users",
          },
        },
        {
          $lookup: {
            from: "projects",
            localField: "_id",
            foreignField: "departmentId",
            as: "projects",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            totalUsers: {
              $size: "$users",
            },
            totalProjects: {
              $size: "$projects",
            },
            totalBudget: {
              $sum: "$projects.budget",
            },
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q12
  async getUsersWithoutTasks(req, res) {
    try {
      const result = await User.aggregate([
        {
          $lookup: {
            from: "tasks",
            localField: "_id",
            foreignField: "assignedTo",
            as: "tasks",
          },
        },
        {
          $match: {
            tasks: {
              $size: 0,
            },
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q13
  async getHighestSalaryDepartment(req, res) {
    try {
      const result = await User.aggregate([
        {
          $lookup: {
            from: "departments",
            localField: "departmentId",
            foreignField: "_id",
            as: "department",
          },
        },
        {
          $unwind: "$department",
        },
        {
          $group: {
            _id: "$departmentId",
            departmentName: {
              $first: "$department.name",
            },
            totalSalaryExpense: {
              $sum: "$salary",
            },
            totalEmployees: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            totalSalaryExpense: -1,
          },
        },
      ]);

      res.status(200).json({
        highestSalaryDepartment: result[0] || null,
        allDepartments: result,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q14
  async getProjectTaskReport(req, res) {
    try {
      const result = await Project.aggregate([
        {
          $lookup: {
            from: "tasks",
            localField: "_id",
            foreignField: "projectId",
            as: "tasks",
          },
        },
        {
          $project: {
            name: 1,

            totalTasks: {
              $size: "$tasks",
            },

            totalCompletedTasks: {
              $size: {
                $filter: {
                  input: "$tasks",
                  as: "task",
                  cond: {
                    $eq: ["$$task.status", "completed"],
                  },
                },
              },
            },

            totalHoursWorked: {
              $sum: "$tasks.hoursWorked",
            },
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q15
  async getMonthlyRegistrations(req, res) {
    try {
      const result = await User.aggregate([
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },
              month: {
                $month: "$createdAt",
              },
            },
            totalUsers: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q16
  async getUserTotalHoursWorked(req, res) {
    try {
      const result = await Task.aggregate([
        {
          $group: {
            _id: "$assignedTo",
            totalHoursWorked: {
              $sum: "$hoursWorked",
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q17
  async getDepartmentsWithHighAverageSalary(req, res) {
    try {
      const result = await User.aggregate([
        {
          $group: {
            _id: "$departmentId",
            averageSalary: {
              $avg: "$salary",
            },
          },
        },
        {
          $match: {
            averageSalary: {
              $gt: 50000,
            },
          },
        },
        {
          $lookup: {
            from: "departments",
            localField: "_id",
            foreignField: "_id",
            as: "department",
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q18
  async getProjectEfficiencyReport(req, res) {
    try {
      const result = await Project.aggregate([
        {
          $lookup: {
            from: "tasks",
            localField: "_id",
            foreignField: "projectId",
            as: "tasks",
          },
        },
        {
          $project: {
            name: 1,
            budget: 1,

            totalHoursWorked: {
              $sum: "$tasks.hoursWorked",
            },

            totalEmployeesInvolved: {
              $size: {
                $setUnion: ["$tasks.assignedTo"],
              },
            },
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q19
  async getUsersWorkingOnMultipleProjects(req, res) {
    try {
      const result = await Task.aggregate([
        {
          $group: {
            _id: "$assignedTo",
            projects: {
              $addToSet: "$projectId",
            },
          },
        },
        {
          $project: {
            _id: 1,
            projects: 1,
            totalProjects: {
              $size: "$projects",
            },
          },
        },
        {
          $match: {
            totalProjects: {
              $gt: 2,
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 0,
            userId: "$_id",
            userName: "$user.name",
            totalProjects: 1,
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //q20
  async getAdminDashboard(req, res) {
    try {
      const result = await User.aggregate([
        {
          $facet: {
            totalUsers: [
              {
                $count: "count",
              },
            ],

            totalSalaryExpense: [
              {
                $group: {
                  _id: null,
                  total: {
                    $sum: "$salary",
                  },
                },
              },
            ],
          },
        },
      ]);

      const totalDepartments = await Department.countDocuments();

      const totalActiveProjects = await Project.countDocuments({
        status: "active",
      });

      const totalCompletedTasks = await Task.countDocuments({
        status: "completed",
      });

      res.status(200).json({
        totalUsers: result[0].totalUsers[0]?.count || 0,

        totalDepartments,

        totalActiveProjects,

        totalCompletedTasks,

        totalSalaryExpense: result[0].totalSalaryExpense[0]?.total || 0,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  //using insertmany to add dummy data
  async generateDummyData(req, res) {
    try {
      await Task.deleteMany({});
      await Project.deleteMany({});
      await User.deleteMany({});
      await Department.deleteMany({});

      //departments
      const departments = await Department.insertMany([
        { name: "IT", location: "Kolkata" },
        { name: "HR", location: "Delhi" },
        { name: "Finance", location: "Mumbai" },
        { name: "Marketing", location: "Bangalore" },
        { name: "Sales", location: "Pune" },
      ]);

      //users(40)
      const users = [];

      for (let i = 1; i <= 40; i++) {
        users.push({
          name: `Employee ${i}`,
          email: `employee${i}@gmail.com`,

          role: i % 10 === 0 ? "manager" : "employee",

          departmentId: departments[i % departments.length]._id,

          salary: 30000 + i * 2500,

          createdAt: new Date(2025, i % 12, (i % 28) + 1),
        });
      }

      const insertedUsers = await User.insertMany(users);

      //projects(12)
      const projects = await Project.insertMany([
        {
          name: "ERP System",
          departmentId: departments[0]._id,
          budget: 500000,
          status: "active",
        },
        {
          name: "CRM System",
          departmentId: departments[0]._id,
          budget: 700000,
          status: "completed",
        },
        {
          name: "HR Portal",
          departmentId: departments[1]._id,
          budget: 250000,
          status: "active",
        },
        {
          name: "Recruitment App",
          departmentId: departments[1]._id,
          budget: 300000,
          status: "completed",
        },
        {
          name: "Accounting System",
          departmentId: departments[2]._id,
          budget: 800000,
          status: "active",
        },
        {
          name: "Payroll Software",
          departmentId: departments[2]._id,
          budget: 450000,
          status: "completed",
        },
        {
          name: "Marketing Dashboard",
          departmentId: departments[3]._id,
          budget: 600000,
          status: "active",
        },
        {
          name: "SEO Analytics",
          departmentId: departments[3]._id,
          budget: 350000,
          status: "completed",
        },
        {
          name: "Sales Tracker",
          departmentId: departments[4]._id,
          budget: 900000,
          status: "active",
        },
        {
          name: "Lead Manager",
          departmentId: departments[4]._id,
          budget: 400000,
          status: "completed",
        },
        {
          name: "Mobile App",
          departmentId: departments[0]._id,
          budget: 1000000,
          status: "active",
        },
        {
          name: "AI Assistant",
          departmentId: departments[2]._id,
          budget: 1500000,
          status: "active",
        },
      ]);

      //tasks(120)
      const tasks = [];

      for (let i = 1; i <= 120; i++) {
        tasks.push({
          title: `Task ${i}`,

          assignedTo: insertedUsers[i % 35]._id,

          projectId: projects[i % projects.length]._id,

          status: i % 3 === 0 ? "completed" : "pending",

          hoursWorked: Math.floor(Math.random() * 20) + 1,
        });
      }

      await Task.insertMany(tasks);

      res.status(201).json({
        success: true,
        message: "Sample Data Generated",

        dataSummary: {
          departments: 5,
          users: 40,
          projects: 12,
          tasks: 120,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  //bulk insert users
  async bulkInsertUsers(req, res) {
    try {
      const users = [];

      for (let i = 1; i <= 10000; i++) {
        users.push({
          insertOne: {
            document: {
              name: `Bulk User ${i}`,
              email: `bulk${i}@gmail.com`,
              role: "employee",
              salary: 40000,
            },
          },
        });
      }

      await User.bulkWrite(users);

      res.status(200).json({
        success: true,
        message: "10000 Users Inserted",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  //view all departments
  async getAllDepartments(req, res) {
    try {
      const departments = await Department.find();

      res.status(200).json(departments);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  //view all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find().populate("departmentId");

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //view all projects
  async getAllProjects(req, res) {
    try {
      const projects = await Project.find().populate("departmentId");

      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //view all tasks
  async getAllTasks(req, res) {
    try {
      const tasks = await Task.find()
        .populate("assignedTo")
        .populate("projectId");

      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = AggregationController;
