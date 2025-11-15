/**
 * Delete Oldest PyPI Version Workflow
 * 
 * This workflow automates the deletion of the oldest version of a PyPI package.
 * Use this when you hit PyPI's version limit and need to clean up old releases.
 * 
 * Steps:
 * 1. Navigate to PyPI package management page and login
 * 2. Find and identify the oldest version
 * 3. Delete the oldest version through the UI
 * 
 * Environment Variables Required:
 * - PYPI_USERNAME: Your PyPI username
 * - PYPI_PASSWORD: Your PyPI password or API token
 * - PYPI_PACKAGE_NAME: The package name (e.g., "terminator-py")
 */

import { createWorkflow, createWorkflowRunner, z } from "@mediar-ai/workflow";
import { config } from "dotenv";

// Load environment variables from .env file
const dotenvResult = config();
if (dotenvResult.error) {
  console.warn("⚠️  No .env file found, using system environment variables");
} else {
  console.log("✅ Loaded environment variables from .env file");
}

import { navigateToPyPI } from "./steps/01-navigate-to-pypi.js";
import { findOldestVersion } from "./steps/02-find-oldest-version.js";
import { deleteVersion } from "./steps/03-delete-version.js";

// Define input schema with validation
const inputSchema = z.object({
  packageName: z.string().min(1, "Package name is required"),
  username: z.string().min(1, "PyPI username is required"),
  password: z.string().min(1, "PyPI password/token is required"),
  dryRun: z.boolean().default(false).describe("If true, will only identify the version without deleting"),
});

// Define the workflow
const workflowConfig = createWorkflow({
  name: "Delete Oldest PyPI Version",
  description: "Automates deletion of the oldest PyPI package version through the web UI",
  version: "1.0.0",
  input: inputSchema,
  tags: ["pypi", "package-management", "automation", "cleanup"],

  // Define the steps in order
  steps: [
    navigateToPyPI,
    findOldestVersion,
    // Only delete if not in dry-run mode
    deleteVersion,
  ],
});

// Check if we need to build or not
const workflow = 'build' in workflowConfig ? workflowConfig.build() : workflowConfig;

// Main execution function
async function main() {
  try {
    console.log("🚀 Starting Delete Oldest PyPI Version Workflow...\n");

    // Get inputs from environment variables
    const packageName = process.env.PYPI_PACKAGE_NAME;
    const username = process.env.PYPI_USERNAME;
    const password = process.env.PYPI_PASSWORD;
    const dryRun = process.env.DRY_RUN === "true";

    // Validate inputs
    if (!packageName || !username || !password) {
      console.error("❌ Missing required environment variables:");
      console.error("   - PYPI_PACKAGE_NAME: The package name (e.g., 'terminator-py')");
      console.error("   - PYPI_USERNAME: Your PyPI username");
      console.error("   - PYPI_PASSWORD: Your PyPI password or API token");
      console.error("\nExample usage:");
      console.error("   export PYPI_PACKAGE_NAME='your-package'");
      console.error("   export PYPI_USERNAME='your-username'");
      console.error("   export PYPI_PASSWORD='your-password'");
      console.error("   npm start");
      process.exit(1);
    }

    console.log(`📦 Package: ${packageName}`);
    console.log(`👤 Username: ${username}`);
    console.log(`🔒 Password: ${"*".repeat(password.length)}`);
    if (dryRun) {
      console.log("🧪 Dry run mode: Will identify version but NOT delete");
    }
    console.log();

    // Create and run the workflow
    const runner = createWorkflowRunner({
      workflow: workflow,
      inputs: {
        packageName,
        username,
        password,
        dryRun,
      },
    });

    const result = await runner.run();

    // Display results
    console.log("\n" + "=".repeat(60));
    console.log("📊 Workflow Result:");
    console.log("=".repeat(60));
    console.log(`Status: ${result.status}`);
    
    if (result.status === "success") {
      console.log("✅ Workflow completed successfully!");
      
      // Access state from the runner's context
      const workflowState = runner.getState();
      const state = workflowState.context.state;
      if (state) {
        console.log("\n📝 Final State:");
        console.log(`   Package: ${state.packageName || packageName}`);
        console.log(`   Total Versions Found: ${state.totalVersions || "N/A"}`);
        console.log(`   Oldest Version: ${state.oldestVersion || "N/A"}`);
        
        if (!dryRun && state.deletedVersion) {
          console.log(`   Deleted Version: ${state.deletedVersion}`);
          console.log(`   Deletion Time: ${state.deletionTimestamp || "N/A"}`);
        }
        
        if (state.allVersions && Array.isArray(state.allVersions) && state.allVersions.length > 0) {
          console.log(`\n   All Versions (sorted): ${state.allVersions.join(", ")}`);
        }
      }
    } else if (result.status === "error") {
      console.log("❌ Workflow failed!");
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }
    
    console.log("=".repeat(60) + "\n");

    // Exit with appropriate code
    process.exit(result.status === "success" ? 0 : 1);

  } catch (error: any) {
    console.error("\n❌ Workflow execution failed:");
    console.error(`   ${error.message}`);
    if (error.stack) {
      console.error("\nStack trace:");
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Export the workflow for MCP/external use
export default workflow;

// Run if this is the main module
// Check multiple conditions for Node.js module execution
const isMainModule = import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/')) || 
                     import.meta.url === `file://${process.argv[1]}` ||
                     process.argv[1].includes('workflow.js');

if (isMainModule) {
  main().catch((error) => {
    console.error("Unhandled error in main:", error);
    process.exit(1);
  });
}
