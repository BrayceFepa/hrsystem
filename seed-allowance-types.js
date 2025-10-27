const db = require("./models");

/**
 * Seed Allowance Types
 *
 * Based on Ethiopian tax and pension deduction rules:
 * - Basic Salary: Deduct TAX and PENSION
 * - Transport Allowance: Up to 600 ETB exempt from TAX & PENSION
 * - Shift Allowance: Deduct TAX only
 * - Representative Allowance: Deduct TAX only
 * - Position Allowance: Deduct TAX only
 * - Overtime: Deduct TAX only
 * - Incentive: Deduct TAX only
 */

const allowanceTypes = [
  {
    name: "Transport",
    code: "TRANSPORT",
    deductionTax: true,
    deductionPension: true,
    maxExemptAmount: 600,
    exemptFromTax: false,
    exemptFromPension: false,
    description:
      "Transport allowance. Up to 600 ETB is exempt from both TAX and PENSION deductions.",
    isActive: true,
    displayOrder: 1,
  },
  {
    name: "Shift",
    code: "SHIFT",
    deductionTax: true,
    deductionPension: false,
    maxExemptAmount: 0,
    exemptFromTax: false,
    exemptFromPension: false,
    description: "Shift allowance. Deduct TAX only (no pension deduction).",
    isActive: true,
    displayOrder: 2,
  },
  {
    name: "Representative",
    code: "REPRESENTATIVE",
    deductionTax: true,
    deductionPension: false,
    maxExemptAmount: 0,
    exemptFromTax: false,
    exemptFromPension: false,
    description:
      "Representative allowance. Deduct TAX only (no pension deduction).",
    isActive: true,
    displayOrder: 3,
  },
  {
    name: "Position",
    code: "POSITION",
    deductionTax: true,
    deductionPension: false,
    maxExemptAmount: 0,
    exemptFromTax: false,
    exemptFromPension: false,
    description: "Position allowance. Deduct TAX only (no pension deduction).",
    isActive: true,
    displayOrder: 4,
  },
  {
    name: "Overtime",
    code: "OVERTIME",
    deductionTax: true,
    deductionPension: false,
    maxExemptAmount: 0,
    exemptFromTax: false,
    exemptFromPension: false,
    description: "Overtime allowance. Deduct TAX only (no pension deduction).",
    isActive: true,
    displayOrder: 5,
  },
  {
    name: "Incentive",
    code: "INCENTIVE",
    deductionTax: true,
    deductionPension: false,
    maxExemptAmount: 0,
    exemptFromTax: false,
    exemptFromPension: false,
    description: "Incentive allowance. Deduct TAX only (no pension deduction).",
    isActive: true,
    displayOrder: 6,
  },
];

async function seedAllowanceTypes() {
  try {
    console.log("🌱 Seeding Allowance Types...");

    const AllowanceType = db.allowanceType;

    for (const allowanceType of allowanceTypes) {
      const [created, isNewRecord] = await AllowanceType.findOrCreate({
        where: { code: allowanceType.code },
        defaults: allowanceType,
      });

      if (isNewRecord) {
        console.log(`✅ Created allowance type: ${allowanceType.name}`);
      } else {
        console.log(`⚠️  Allowance type already exists: ${allowanceType.name}`);
      }
    }

    console.log("✅ Allowance types seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding allowance types:", error);
  }
}

module.exports = { seedAllowanceTypes, allowanceTypes };
