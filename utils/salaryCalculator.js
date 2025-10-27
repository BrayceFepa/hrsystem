/**
 * Salary Calculation Utility
 *
 * Implements Ethiopian tax and pension deduction rules:
 * - Basic Salary: Deduct TAX and PENSION
 * - Transport Allowance: Up to 600 ETB exempt from TAX & PENSION
 * - Shift Allowance: Deduct TAX only
 * - Representative Allowance: Deduct TAX only
 * - Position Allowance: Deduct TAX only
 * - Overtime: Deduct TAX only
 * - Incentive: Deduct TAX only
 */

/**
 * Calculate salary components based on allowances and their rules
 * @param {Object} params - Salary calculation parameters
 * @param {number} params.basicSalary - Basic salary amount
 * @param {Array} params.allowances - Array of allowance objects with type and amount
 * @param {number} params.taxRate - Tax rate (default: 0.30 for 30%)
 * @param {number} params.pensionRate - Pension rate (default: 0.07 for 7%)
 * @returns {Object} Calculated salary breakdown
 */
function calculateSalary(params) {
  const {
    basicSalary = 0,
    allowances = [],
    taxRate = 0.3,
    pensionRate = 0.07,
  } = params;

  // Initialize totals
  let taxableIncome = basicSalary;
  let pensionableIncome = basicSalary;
  let totalAllowances = 0;

  // Process each allowance based on its rules
  const allowanceBreakdown = allowances.map((allowance) => {
    const {
      amount,
      deductionTax,
      deductionPension,
      maxExemptAmount = 0,
      exemptFromTax = false,
      exemptFromPension = false,
    } = allowance;

    const processedAmount = amount || 0;
    totalAllowances += processedAmount;

    // Calculate exempt amount (capped at maxExemptAmount)
    const exemptAmount =
      maxExemptAmount > 0 ? Math.min(processedAmount, maxExemptAmount) : 0;

    // Calculate taxable amount (remaining after exempt portion)
    const taxableAmount =
      deductionTax && !exemptFromTax ? processedAmount - exemptAmount : 0;

    // Add to taxable income if applicable
    taxableIncome += taxableAmount;

    // Calculate pensionable amount
    const pensionableAmount =
      deductionPension && !exemptFromPension
        ? processedAmount - exemptAmount
        : 0;

    // Add to pensionable income if applicable
    pensionableIncome += pensionableAmount;

    return {
      ...allowance,
      amount: processedAmount,
      taxableAmount: taxableAmount,
      pensionableAmount: pensionableAmount,
      exemptAmount: exemptAmount,
    };
  });

  // Calculate gross salary
  const grossSalary = basicSalary + totalAllowances;

  // Calculate tax deduction
  const taxDeduction = taxableIncome * taxRate;

  // Calculate pension deduction
  const pensionDeduction = pensionableIncome * pensionRate;

  // Calculate total deductions
  const totalDeductions = taxDeduction + pensionDeduction;

  // Calculate net salary
  const netSalary = grossSalary - totalDeductions;

  return {
    basicSalary,
    allowances: allowanceBreakdown,
    totalAllowances,
    grossSalary: Math.round(grossSalary),
    taxableIncome: Math.round(taxableIncome),
    pensionableIncome: Math.round(pensionableIncome),
    deductions: {
      tax: Math.round(taxDeduction),
      pension: Math.round(pensionDeduction),
      total: Math.round(totalDeductions),
    },
    netSalary: Math.round(netSalary),
    breakdown: {
      taxRate,
      pensionRate,
      grossCalculation: `${basicSalary} + ${totalAllowances} = ${grossSalary}`,
      taxCalculation: `${taxableIncome} × ${taxRate} = ${taxDeduction}`,
      pensionCalculation: `${pensionableIncome} × ${pensionRate} = ${pensionDeduction}`,
      netCalculation: `${grossSalary} - ${totalDeductions} = ${netSalary}`,
    },
  };
}

/**
 * Calculate salary from user financial info and employee allowances
 * @param {Object} userFinancialInfo - User's financial info
 * @param {Array} employeeAllowances - Array of employee allowance objects
 * @param {Object} options - Calculation options
 * @returns {Object} Calculated salary
 */
function calculateSalaryFromUserData(
  userFinancialInfo,
  employeeAllowances = [],
  options = {}
) {
  const { salaryBasic = 0, taxRate = 0.3, pensionRate = 0.07 } = options;

  // Get current active allowances only
  const activeAllowances = employeeAllowances.filter(
    (allowance) =>
      allowance.isActive && !allowance.endDate && allowance.allowanceType // Make sure type is loaded
  );

  // Map employee allowances to calculation format
  const allowancesForCalculation = activeAllowances.map((allowance) => ({
    name: allowance.allowanceType?.name || "Unknown",
    code: allowance.allowanceType?.code || "",
    amount: allowance.amount || 0,
    deductionTax: allowance.allowanceType?.deductionTax ?? true,
    deductionPension: allowance.allowanceType?.deductionPension ?? true,
    maxExemptAmount: allowance.allowanceType?.maxExemptAmount || 0,
    exemptFromTax: allowance.allowanceType?.exemptFromTax ?? false,
    exemptFromPension: allowance.allowanceType?.exemptFromPension ?? false,
  }));

  // Calculate using the main function
  return calculateSalary({
    basicSalary: userFinancialInfo.salaryBasic || salaryBasic,
    allowances: allowancesForCalculation,
    taxRate,
    pensionRate,
  });
}

/**
 * Get allowance calculation summary
 * @param {Object} calculationResult - Result from calculateSalary
 * @returns {Object} Summary of allowance calculations
 */
function getAllowanceSummary(calculationResult) {
  return {
    totalAllowances: calculationResult.totalAllowances,
    totalTaxableAllowances: calculationResult.allowances.reduce(
      (sum, a) => sum + a.taxableAmount,
      0
    ),
    totalPensionableAllowances: calculationResult.allowances.reduce(
      (sum, a) => sum + a.pensionableAmount,
      0
    ),
    totalExemptAllowances: calculationResult.allowances.reduce(
      (sum, a) => sum + a.exemptAmount,
      0
    ),
    allowancesByType: calculationResult.allowances.map((a) => ({
      name: a.name,
      amount: a.amount,
      taxableAmount: a.taxableAmount,
      pensionableAmount: a.pensionableAmount,
      exemptAmount: a.exemptAmount,
    })),
  };
}

module.exports = {
  calculateSalary,
  calculateSalaryFromUserData,
  getAllowanceSummary,
};
