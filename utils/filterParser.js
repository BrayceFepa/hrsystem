const { Op } = require("sequelize");

/**
 * Parse flexible filter parameters
 * Supports both structured filters and simple query parameters
 *
 * Structured filter format:
 * ?filter=[{"field":"fullName","operator":"contains","value":"John"}]
 *
 * Simple query parameters:
 * ?fullName=John&email=john@example.com
 */
exports.parseFilters = (req) => {
  const {
    filter,
    fullName,
    email,
    departmentId,
    jobTitle,
    salaryMin,
    salaryMax,
    ...otherParams
  } = req.query;

  let whereClause = {};
  let includeClause = [];

  // Parse structured filters if provided
  if (filter) {
    try {
      const filters = JSON.parse(filter);
      if (Array.isArray(filters)) {
        filters.forEach((filterItem) => {
          const { field, operator, value } = filterItem;

          if (!field || !operator || value === undefined) {
            return; // Skip invalid filters
          }

          const condition = buildCondition(field, operator, value);
          if (condition) {
            if (condition.include) {
              includeClause.push(condition.include);
            } else {
              Object.assign(whereClause, condition.where);
            }
          }
        });
      }
    } catch (error) {
      console.error("Error parsing filter:", error);
      // Continue with simple filters if structured filter parsing fails
    }
  }

  // Parse simple query parameters
  if (fullName) {
    whereClause.full_name = { [Op.like]: `%${decodeURIComponent(fullName)}%` };
  }

  if (email) {
    // Email is in UserPersonalInfo, so we need to include it
    includeClause.push({
      model: require("../models").userPersonalInfo,
      where: { email_address: { [Op.like]: `%${email}%` } },
      required: true,
    });
  }

  if (departmentId) {
    whereClause.department_id = departmentId;
  }

  if (jobTitle) {
    includeClause.push({
      model: require("../models").job,
      where: { job_title: { [Op.like]: `%${jobTitle}%` } },
      required: true,
    });
  }

  if (salaryMin || salaryMax) {
    const salaryCondition = {};
    if (salaryMin) salaryCondition[Op.gte] = parseFloat(salaryMin);
    if (salaryMax) salaryCondition[Op.lte] = parseFloat(salaryMax);

    includeClause.push({
      model: require("../models").userFinancialInfo,
      where: { salary_basic: salaryCondition },
      required: true,
    });
  }

  // Handle other existing parameters
  if (otherParams.role) {
    const roles = otherParams.role.split(",").map((r) => r.trim());
    whereClause.role = roles.length === 1 ? roles[0] : { [Op.in]: roles };
  }

  if (otherParams.active !== undefined) {
    whereClause.active =
      otherParams.active === "true" || otherParams.active === true;
  }

  if (otherParams.empStatus) {
    includeClause.push({
      model: require("../models").job,
      where: { emp_status: otherParams.empStatus },
      required: true,
    });
  }

  return { whereClause, includeClause };
};

/**
 * Build Sequelize condition based on field, operator, and value
 */
function buildCondition(field, operator, value) {
  const db = require("../models");
  const { Op } = require("sequelize");

  // Define field mappings
  const fieldMappings = {
    fullName: { table: "user", field: "full_name" },
    username: { table: "user", field: "username" },
    email: { table: "userPersonalInfo", field: "email_address" },
    phone: { table: "userPersonalInfo", field: "phone" },
    mobile: { table: "userPersonalInfo", field: "mobile" },
    departmentId: { table: "user", field: "department_id" },
    departmentName: { table: "department", field: "department_name" },
    jobTitle: { table: "job", field: "job_title" },
    empStatus: { table: "job", field: "emp_status" },
    empType: { table: "job", field: "emp_type" },
    salaryBasic: { table: "userFinancialInfo", field: "salary_basic" },
    salaryGross: { table: "userFinancialInfo", field: "salary_gross" },
    role: { table: "user", field: "role" },
    active: { table: "user", field: "active" },
  };

  const fieldConfig = fieldMappings[field];
  if (!fieldConfig) {
    return null; // Unknown field
  }

  // Build operator condition
  let condition;
  switch (operator.toLowerCase()) {
    case "equal":
    case "eq":
    case "=":
      condition = value;
      break;
    case "not_equal":
    case "ne":
    case "!=":
      condition = { [Op.ne]: value };
      break;
    case "contains":
    case "like":
      condition = { [Op.like]: `%${value}%` };
      break;
    case "starts_with":
    case "startswith":
      condition = { [Op.like]: `${value}%` };
      break;
    case "ends_with":
    case "endswith":
      condition = { [Op.like]: `%${value}` };
      break;
    case "greater_than":
    case "gt":
    case ">":
      condition = { [Op.gt]: parseFloat(value) };
      break;
    case "greater_equal":
    case "gte":
    case ">=":
      condition = { [Op.gte]: parseFloat(value) };
      break;
    case "less_than":
    case "lt":
    case "<":
      condition = { [Op.lt]: parseFloat(value) };
      break;
    case "less_equal":
    case "lte":
    case "<=":
      condition = { [Op.lte]: parseFloat(value) };
      break;
    case "in":
      condition = { [Op.in]: Array.isArray(value) ? value : value.split(",") };
      break;
    case "not_in":
    case "notin":
      condition = {
        [Op.notIn]: Array.isArray(value) ? value : value.split(","),
      };
      break;
    case "between":
      if (Array.isArray(value) && value.length === 2) {
        condition = { [Op.between]: value };
      }
      break;
    case "is_null":
    case "isnull":
      condition = { [Op.is]: null };
      break;
    case "is_not_null":
    case "isnotnull":
      condition = { [Op.not]: null };
      break;
    default:
      return null; // Unknown operator
  }

  if (!condition) {
    return null;
  }

  // If field is in a related table, return include condition
  if (fieldConfig.table !== "user") {
    const modelMap = {
      userPersonalInfo: db.userPersonalInfo,
      userFinancialInfo: db.userFinancialInfo,
      department: db.department,
      job: db.job,
    };

    return {
      include: {
        model: modelMap[fieldConfig.table],
        where: { [fieldConfig.field]: condition },
        required: true,
      },
    };
  }

  // If field is in main user table, return where condition
  return {
    where: { [fieldConfig.field]: condition },
  };
}

/**
 * Get available filter fields and operators for documentation
 */
exports.getFilterInfo = () => {
  return {
    fields: [
      "fullName",
      "username",
      "email",
      "phone",
      "mobile",
      "departmentId",
      "departmentName",
      "jobTitle",
      "empStatus",
      "empType",
      "salaryBasic",
      "salaryGross",
      "role",
      "active",
    ],
    operators: [
      "equal",
      "not_equal",
      "contains",
      "starts_with",
      "ends_with",
      "greater_than",
      "greater_equal",
      "less_than",
      "less_equal",
      "in",
      "not_in",
      "between",
      "is_null",
      "is_not_null",
    ],
    examples: [
      {
        description: "Find users with full name containing 'John'",
        filter: '[{"field":"fullName","operator":"contains","value":"John"}]',
      },
      {
        description: "Find users with email ending with '@company.com'",
        filter:
          '[{"field":"email","operator":"ends_with","value":"@company.com"}]',
      },
      {
        description: "Find users with salary between 50000 and 100000",
        filter:
          '[{"field":"salaryBasic","operator":"between","value":[50000,100000]}]',
      },
      {
        description: "Find active employees in specific roles",
        filter:
          '[{"field":"role","operator":"in","value":["ROLE_EMPLOYEE","ROLE_MANAGER"]},{"field":"active","operator":"equal","value":true}]',
      },
    ],
  };
};
