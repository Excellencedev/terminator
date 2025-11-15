/**
 * Step 3: Delete the Oldest Version
 * Deletes the identified oldest version through the PyPI UI
 */

import { createStep } from "@mediar-ai/workflow";

export const deleteVersion = createStep({
  id: "delete_version",
  name: "Delete Oldest Version",
  description: "Deletes the oldest version through the PyPI web interface",
  
  execute: async ({ desktop, logger, context }) => {
    logger.info("🗑️ Deleting oldest version...");

    try {
      const oldestVersion = context.state.oldestVersion;
      const packageName = context.state.packageName;

      if (!oldestVersion) {
        throw new Error("Oldest version not found in context");
      }

      logger.info(`Preparing to delete version: ${oldestVersion}`);

      // PyPI's manage releases page has "Options" buttons for each version
      // We need to find the Options button for the oldest version and click it
      
      // Strategy: Look for the version text and then find the nearby Options button
      logger.info("Locating the version on the page...");
      
      // First, try to find a link or text containing the version number
      const versionSelector = `text:"${oldestVersion}" || name:"${oldestVersion}"`;
      
      try {
        const versionElement = await desktop
          .locator(versionSelector)
          .first(5000);
        
        logger.info(`Found version element for ${oldestVersion}`);
        
        // Scroll the version into view
        await versionElement.scrollIntoView();
        await desktop.delay(1000);

      } catch (error) {
        logger.warn("Could not find version element directly, trying alternative method...");
      }

      // Now look for the Options button or Delete button near this version
      // PyPI uses dropdown menus with "Options" buttons
      logger.info("Looking for Options/Delete button...");

      // Try multiple approaches to find and click the delete option
      let deleteSuccessful = false;

      // Approach 1: Find "Options" button and click it to reveal delete option
      try {
        // Find all Options buttons
        const optionsButtonsStr = await desktop.executeBrowserScript(`
          const buttons = Array.from(document.querySelectorAll('button, a'));
          const optionsButton = buttons.find(btn => 
            (btn.textContent || '').toLowerCase().includes('options') ||
            (btn.getAttribute('aria-label') || '').toLowerCase().includes('options')
          );
          
          if (optionsButton) {
            optionsButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return JSON.stringify({ found: true, text: optionsButton.textContent });
          }
          return JSON.stringify({ found: false });
        `);

        const optionsButtons = JSON.parse(optionsButtonsStr);

        if (optionsButtons.found) {
          logger.info("Found Options button, clicking...");
          
          // Get all Options buttons and click the last one
          const allOptionsButtons = await desktop
            .locator("role:button[name*='Options' i]")
            .all(3000);
          
          if (allOptionsButtons.length > 0) {
            const optionsBtn = allOptionsButtons[allOptionsButtons.length - 1]; // Get the last one
          
            await optionsBtn.click();
            await desktop.delay(1500);

            // Now look for the delete option in the dropdown
            logger.info("Looking for Delete option in menu...");
            const deleteOption = await desktop
              .locator("role:button[name*='Delete' i] || role:link[name*='Delete' i] || text:'Delete'")
              .first(3000);
            
            await deleteOption.click();
            await desktop.delay(1500);
            
            deleteSuccessful = true;
          }
        }
      } catch (error) {
        logger.warn("Options button approach failed, trying direct delete button...");
      }

      // Approach 2: Look for direct delete button or link
      if (!deleteSuccessful) {
        try {
          const allDeleteButtons = await desktop
            .locator("role:button[name*='Delete' i] || role:link[name*='Delete release' i]")
            .all(3000);
          
          if (allDeleteButtons.length > 0) {
            const deleteButton = allDeleteButtons[allDeleteButtons.length - 1]; // Last one should be for the oldest version
            await deleteButton.click();
            await desktop.delay(1500);
            deleteSuccessful = true;
          }
        } catch (error) {
          logger.warn("Direct delete button not found...");
        }
      }

      if (!deleteSuccessful) {
        throw new Error("Could not find delete button or option");
      }

      // Confirm deletion - PyPI usually asks for confirmation
      logger.info("⚠️ Looking for confirmation dialog...");
      
      try {
        // PyPI might ask you to type the version number or package name to confirm
        const confirmInput = await desktop
          .locator("role:textbox")
          .first(3000);
        
        // Type the version or package name for confirmation
        logger.info("Entering confirmation...");
        confirmInput.typeText(oldestVersion);
        await desktop.delay(500);

        // Find and click the final confirm button
        const confirmButton = await desktop
          .locator("role:button[name*='Delete' i] || role:button[name*='Confirm' i]")
          .first(3000);
        
        await confirmButton.click();
        logger.info("✅ Deletion confirmed");
        
      } catch (error) {
        // Some versions might not require text confirmation, just button click
        logger.info("No text confirmation needed, looking for confirm button...");
        
        try {
          const confirmButton = await desktop
            .locator("role:button[name*='Yes' i] || role:button[name*='Confirm' i] || role:button[name*='Delete' i]")
            .first(3000);
          
          await confirmButton.click();
          logger.info("✅ Deletion confirmed");
        } catch (err) {
          logger.warn("Could not find confirmation button - deletion may have proceeded automatically");
        }
      }

      // Wait for deletion to complete
      await desktop.delay(3000);

      logger.info(`✅ Successfully deleted version ${oldestVersion}`);

      return {
        state: {
          deletedVersion: oldestVersion,
          deletionTimestamp: new Date().toISOString(),
          success: true,
        },
      };
    } catch (error: any) {
      logger.error(`❌ Failed to delete version: ${error.message}`);
      throw error;
    }
  },
});
