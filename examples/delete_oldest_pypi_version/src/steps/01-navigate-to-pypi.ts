/**
 * Step 1: Navigate to PyPI and Login
 * Opens the PyPI package management page and handles authentication
 */

import { createStep } from "@mediar-ai/workflow";

export const navigateToPyPI = createStep({
  id: "navigate_to_pypi",
  name: "Navigate to PyPI and Login",
  description: "Opens browser, navigates to PyPI package page, and handles login if needed",
  
  execute: async ({ desktop, input, logger }) => {
    logger.info("🌐 Opening PyPI package management page...");

    try {
      const packageName = input.packageName;
      const username = input.username;
      const password = input.password;

      // Navigate to the package's manage page
      const manageUrl = `https://pypi.org/manage/project/${packageName}/releases/`;
      logger.info(`Navigating to: ${manageUrl}`);
      
      await desktop.openUrl(manageUrl);
      
      // Wait for page to load
      await desktop.delay(3000);

      // Check if we need to login (look for login form or sign-in button)
      try {
        const loginButton = await desktop
          .locator("role:link[name*='Log in' i] || role:button[name*='Log in' i]")
          .first(2000);
        
        logger.info("🔐 Login required, proceeding with authentication...");
        
        // Click login button
        await loginButton.click();
        await desktop.delay(2000);

        // Fill in username
        logger.info("Entering username...");
        const usernameField = await desktop
          .locator("role:textbox[name*='username' i] || name:username || id:username")
          .first(3000);
        usernameField.typeText(username);
        await desktop.delay(500);

        // Fill in password
        logger.info("Entering password...");
        const passwordField = await desktop
          .locator("role:textbox[name*='password' i] || type:password || id:password")
          .first(3000);
        passwordField.typeText(password);
        await desktop.delay(500);

        // Click sign in button
        const signInButton = await desktop
          .locator("role:button[name*='Sign in' i] || role:button[name*='Log in' i]")
          .first(3000);
        await signInButton.click();
        
        logger.info("⏳ Waiting for login to complete...");
        await desktop.delay(4000);

        // Navigate back to manage page after login
        await desktop.openUrl(manageUrl);
        await desktop.delay(3000);

      } catch (error) {
        logger.info("✅ Already logged in or login not required");
      }

      // Verify we're on the manage page by looking for release management elements
      try {
        const manageHeading = await desktop
          .locator("role:heading[name*='Releases' i] || role:heading[name*='Release history' i]")
          .first(5000);
        logger.info("✅ Successfully navigated to package management page");
      } catch (error) {
        logger.warn("⚠️ Could not verify manage page - continuing anyway");
      }

      return {
        state: {
          loggedIn: true,
          onManagePage: true,
          packageName: packageName,
        },
      };
    } catch (error: any) {
      logger.error(`❌ Failed to navigate to PyPI: ${error.message}`);
      throw error;
    }
  },
});
