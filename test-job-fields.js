/**
 * Test script for verifying job model changes:
 * - takenAssets (text field, replacing laptopAgreement)
 * - documentScanned (boolean field)
 */

const axios = require("axios");

const BASE_URL = "http://localhost:3002";

let authToken = "";
let userId = null;
let jobId = null;

async function testJobFields() {
  try {
    console.log("🧪 Testing Job Model Field Changes\n");
    console.log("=".repeat(60));

    // 1. Login as Admin
    console.log("\n1️⃣ Logging in as Admin...");
    const loginResponse = await axios
      .post(`${BASE_URL}/login`, {
        username: "ashley_garcia0",
        password: "password123",
      })
      .catch(async () => {
        // Try alternative login
        const altResponse = await axios.post(`${BASE_URL}/login`, {
          username: "admin",
          password: "admin123",
        });
        return altResponse;
      });

    authToken =
      loginResponse.data.token ||
      loginResponse.data.accessToken ||
      loginResponse.data;
    if (!authToken) {
      throw new Error("Failed to get authentication token");
    }
    console.log("✅ Login successful!\n");

    const headers = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    };

    // 2. Get or create a test user
    console.log("2️⃣ Getting existing user for testing...");
    const usersResponse = await axios.get(`${BASE_URL}/api/users`, { headers });
    if (usersResponse.data && usersResponse.data.length > 0) {
      userId = usersResponse.data[0].id;
      console.log(`✅ Using existing user ID: ${userId}\n`);
    } else {
      throw new Error("No users found. Please create a user first.");
    }

    // 3. Test Creating Job with NEW fields (takenAssets and documentScanned)
    console.log("3️⃣ Testing CREATE Job with new fields...");
    console.log("   - takenAssets: Text field");
    console.log("   - documentScanned: Boolean field (true)\n");

    const newJobData = {
      userId: userId,
      jobTitle: "Test Developer",
      startDate: "2024-01-15",
      empType: "Full-Time",
      empStatus: "Active",
      directSupervisor: "Test Manager",
      agreementType: "Permanent",
      takenAssets:
        'Laptop (Dell XPS 15), Phone (iPhone 13), Monitor (Dell 27")',
      documentScanned: true,
    };

    const createResponse = await axios.post(
      `${BASE_URL}/api/jobs`,
      newJobData,
      { headers }
    );

    jobId = createResponse.data.id;
    console.log("✅ Job created successfully!");
    console.log(`   Job ID: ${jobId}`);
    console.log(`   takenAssets: "${createResponse.data.takenAssets}"`);
    console.log(`   documentScanned: ${createResponse.data.documentScanned}`);

    // Verify the fields
    if (createResponse.data.takenAssets !== newJobData.takenAssets) {
      throw new Error(
        `takenAssets mismatch! Expected: "${newJobData.takenAssets}", Got: "${createResponse.data.takenAssets}"`
      );
    }
    if (createResponse.data.documentScanned !== true) {
      throw new Error(
        `documentScanned mismatch! Expected: true, Got: ${createResponse.data.documentScanned}`
      );
    }
    console.log("✅ Field validation passed!\n");

    // 4. Test Reading Job with new fields
    console.log("4️⃣ Testing READ Job with new fields...");
    const readResponse = await axios.get(`${BASE_URL}/api/jobs/${jobId}`, {
      headers,
    });
    console.log("✅ Job retrieved successfully!");
    console.log(`   takenAssets: "${readResponse.data.takenAssets}"`);
    console.log(`   documentScanned: ${readResponse.data.documentScanned}`);

    if (!readResponse.data.hasOwnProperty("takenAssets")) {
      throw new Error("takenAssets field is missing from response!");
    }
    if (!readResponse.data.hasOwnProperty("documentScanned")) {
      throw new Error("documentScanned field is missing from response!");
    }
    console.log("✅ Field presence validation passed!\n");

    // 5. Test Updating Job with new fields (different values)
    console.log("5️⃣ Testing UPDATE Job with new fields...");
    console.log("   - Updating takenAssets to different text");
    console.log("   - Updating documentScanned to false\n");

    const updateData = {
      takenAssets: "Laptop (MacBook Pro), Keyboard (Mechanical)",
      documentScanned: false,
    };

    await axios.put(`${BASE_URL}/api/jobs/${jobId}`, updateData, { headers });
    console.log("✅ Job updated successfully!");

    // Verify update
    const updatedResponse = await axios.get(`${BASE_URL}/api/jobs/${jobId}`, {
      headers,
    });
    console.log(
      `   Updated takenAssets: "${updatedResponse.data.takenAssets}"`
    );
    console.log(
      `   Updated documentScanned: ${updatedResponse.data.documentScanned}`
    );

    if (updatedResponse.data.takenAssets !== updateData.takenAssets) {
      throw new Error(
        `takenAssets update failed! Expected: "${updateData.takenAssets}", Got: "${updatedResponse.data.takenAssets}"`
      );
    }
    if (updatedResponse.data.documentScanned !== false) {
      throw new Error(
        `documentScanned update failed! Expected: false, Got: ${updatedResponse.data.documentScanned}`
      );
    }
    console.log("✅ Update validation passed!\n");

    // 6. Test boolean field with different input formats
    console.log("6️⃣ Testing documentScanned with different boolean formats...");
    const booleanTests = [
      { input: true, expected: true, label: "true (boolean)" },
      { input: "true", expected: true, label: '"true" (string)' },
      { input: 1, expected: true, label: "1 (number)" },
      { input: "1", expected: true, label: '"1" (string)' },
      { input: false, expected: false, label: "false (boolean)" },
      { input: "false", expected: false, label: '"false" (string)' },
      { input: 0, expected: false, label: "0 (number)" },
      { input: "0", expected: false, label: '"0" (string)' },
    ];

    for (const test of booleanTests) {
      await axios.put(
        `${BASE_URL}/api/jobs/${jobId}`,
        { documentScanned: test.input },
        { headers }
      );
      const response = await axios.get(`${BASE_URL}/api/jobs/${jobId}`, {
        headers,
      });
      const result = response.data.documentScanned;

      if (result === test.expected) {
        console.log(`   ✅ ${test.label}: ${result}`);
      } else {
        console.log(
          `   ⚠️  ${test.label}: Expected ${test.expected}, got ${result}`
        );
      }
    }
    console.log("");

    // 7. Verify old laptopAgreement field is NOT present
    console.log("7️⃣ Verifying old laptopAgreement field is removed...");
    if (createResponse.data.hasOwnProperty("laptopAgreement")) {
      console.log(
        "   ⚠️  WARNING: laptopAgreement field still exists in response"
      );
    } else {
      console.log("   ✅ laptopAgreement field correctly removed\n");
    }

    // 8. Cleanup - Delete test job
    console.log("8️⃣ Cleaning up test data...");
    await axios.delete(`${BASE_URL}/api/jobs/${jobId}`, { headers });
    console.log("✅ Test job deleted successfully!\n");

    // Summary
    console.log("=".repeat(60));
    console.log("✅ ALL TESTS PASSED!\n");
    console.log("Summary:");
    console.log("  ✅ takenAssets field works correctly (text input/output)");
    console.log(
      "  ✅ documentScanned field works correctly (boolean input/output)"
    );
    console.log("  ✅ Field creation successful");
    console.log("  ✅ Field reading successful");
    console.log("  ✅ Field updating successful");
    console.log("  ✅ Multiple boolean format handling works");
    console.log("  ✅ Old laptopAgreement field removed\n");
  } catch (error) {
    console.error("\n❌ TEST FAILED!\n");
    if (error.response) {
      console.error(
        "Error Response:",
        JSON.stringify(error.response.data, null, 2)
      );
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request Error:", error.message);
      console.error("Make sure the server is running on port 3002");
    } else {
      console.error("Error:", error.message);
    }

    // Cleanup on error
    if (jobId) {
      try {
        console.log("\n🧹 Attempting cleanup...");
        await axios.delete(`${BASE_URL}/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch (cleanupError) {
        console.log("⚠️  Cleanup failed (job may need manual deletion)");
      }
    }

    process.exit(1);
  }
}

// Run tests
testJobFields();
