/**
 * Step 2: Find the Oldest Version
 * Identifies the oldest version from the PyPI releases page
 */

import { createStep } from "@mediar-ai/workflow";

export const findOldestVersion = createStep({
  id: "find_oldest_version",
  name: "Find Oldest Version",
  description: "Locates the oldest version in the releases list",
  
  execute: async ({ desktop, input, logger, context }) => {
    logger.info("🔍 Finding the oldest version...");

    try {
      const packageName = context.state.packageName;

      // On PyPI, releases are typically listed in descending order (newest first)
      // We need to scroll down and find the last (oldest) version
      
      // First, let's find all version links/elements
      // PyPI release management page shows versions with "Options" dropdowns
      logger.info("Looking for version list...");
      
      // Wait a moment for the page to be fully loaded
      await desktop.delay(2000);

      // Find the releases section - it contains rows with version numbers
      // Each release has a version number and an "Options" button
      logger.info("Locating release entries...");

      // Scroll down to ensure all versions are visible
      logger.info("Scrolling to view all versions...");
      for (let i = 0; i < 3; i++) {
        await desktop.pressKey("End");
        await desktop.delay(500);
      }

      // Look for the last version in the list
      // PyPI typically shows versions in a table or list format
      // We'll use a browser script to extract version information
      logger.info("Extracting version information from page...");

      const versionInfoStr = await desktop.executeBrowserScript(`
        // Find all version elements on the page
        // PyPI uses different structures, so we'll try multiple approaches
        
        let versions = [];
        
        // Approach 1: Look for release cards or sections
        const releaseElements = document.querySelectorAll('[class*="release"], [class*="package-snippet"]');
        if (releaseElements.length > 0) {
          releaseElements.forEach(el => {
            const versionText = el.textContent || '';
            const versionMatch = versionText.match(/\\b\\d+\\.\\d+\\.\\d+[\\w.-]*\\b/);
            if (versionMatch) {
              versions.push(versionMatch[0]);
            }
          });
        }
        
        // Approach 2: Look for version numbers in links or headings
        if (versions.length === 0) {
          const versionLinks = document.querySelectorAll('a[href*="/project/"], h2, h3');
          versionLinks.forEach(el => {
            const text = el.textContent || '';
            const versionMatch = text.match(/\\b\\d+\\.\\d+\\.\\d+[\\w.-]*\\b/);
            if (versionMatch) {
              versions.push(versionMatch[0]);
            }
          });
        }
        
        // Approach 3: Look in the entire page content
        if (versions.length === 0) {
          const pageText = document.body.textContent || '';
          const versionMatches = pageText.match(/\\b\\d+\\.\\d+\\.\\d+[\\w.-]*\\b/g);
          if (versionMatches) {
            versions = versionMatches;
          }
        }
        
        // Remove duplicates and sort versions
        versions = [...new Set(versions)];
        
        return JSON.stringify({
          versions: versions,
          count: versions.length
        });
      `);

      const versionInfo = JSON.parse(versionInfoStr);
      logger.info(`Found ${versionInfo.count} versions: ${versionInfo.versions.join(', ')}`);

      if (versionInfo.count === 0) {
        throw new Error("No versions found on the page");
      }

      // Sort versions to find the oldest (semantic versioning)
      const sortedVersions = versionInfo.versions.sort((a: string, b: string) => {
        const aParts = a.split('.').map(part => {
          const num = parseInt(part.replace(/[^0-9]/g, ''));
          return isNaN(num) ? 0 : num;
        });
        const bParts = b.split('.').map(part => {
          const num = parseInt(part.replace(/[^0-9]/g, ''));
          return isNaN(num) ? 0 : num;
        });
        
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const aVal = aParts[i] || 0;
          const bVal = bParts[i] || 0;
          if (aVal !== bVal) return aVal - bVal;
        }
        return 0;
      });

      const oldestVersion = sortedVersions[0];
      logger.info(`🎯 Identified oldest version: ${oldestVersion}`);

      return {
        state: {
          oldestVersion: oldestVersion,
          totalVersions: versionInfo.count,
          allVersions: sortedVersions,
        },
      };
    } catch (error: any) {
      logger.error(`❌ Failed to find oldest version: ${error.message}`);
      throw error;
    }
  },
});
