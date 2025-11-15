# Video Demo Guide

This guide helps you create a demo video for issue #357 bounty submission.

## Requirements (as per issue)

- Use **your own PyPI account** for the demo
- Show the workflow **actually works** (not just code)
- Demonstrate **deleting the oldest PyPI release**
- Duration: **2-5 minutes** recommended

## Setup Before Recording

### 1. Prepare a Test Package

Create or use an existing PyPI package with multiple versions:

```bash
# Option A: Use an existing package you maintain
# Option B: Create a test package with multiple versions
```

**Important**: Make sure you have at least 2-3 versions published so you can safely delete one.

### 2. Install and Build the Workflow

```bash
cd examples/delete_oldest_pypi_version
npm install
npm run build
```

### 3. Configure Credentials

Create `.env` file:

```env
PYPI_USERNAME=__token__
PYPI_PASSWORD=pypi-your-personal-api-token
PYPI_PACKAGE_NAME=your-test-package-name
DRY_RUN=false
```

Get your PyPI token: https://pypi.org/manage/account/token/

### 4. Test Run (Off Camera)

Do a test run first to ensure everything works:

```bash
npm start
```

Verify:
- ✅ Login works
- ✅ Oldest version is identified correctly
- ✅ Deletion completes successfully

## Recording the Video

### Option 1: Screen Recording with Narration

**Tools**: OBS Studio, QuickTime (Mac), Xbox Game Bar (Windows)

**Steps**:

1. **Introduction (15 seconds)**
   - State your name and that this is for issue #357
   - Briefly explain what the workflow does

2. **Show Current State (30 seconds)**
   - Open browser to your PyPI package page
   - Show the list of current versions
   - Point out which version is the oldest
   - Note the total number of versions

3. **Run the Workflow (2-3 minutes)**
   - Show the terminal
   - Display the `.env` file (hide the actual token)
   - Run `npm start`
   - Show the console output as it executes:
     - Navigation to PyPI
     - Login (if visible)
     - Finding oldest version
     - Deleting the version

4. **Verify Results (30 seconds)**
   - Refresh the PyPI package page
   - Show that the oldest version is now gone
   - Count versions to confirm one was deleted

5. **Conclusion (15 seconds)**
   - Summarize what happened
   - Mention the workflow is integrated in GitHub Actions

### Option 2: Split Screen Recording

**Layout**:
- Left side: Terminal showing workflow execution
- Right side: Browser showing PyPI page

**Steps**: Same as Option 1 but with simultaneous views

### Option 3: Time-lapse Style

If you prefer no narration:

1. Show PyPI page "before" - list all versions
2. Run the workflow (full console output visible)
3. Show PyPI page "after" - oldest version deleted
4. Add text overlays explaining each step

## What to Show

### Must Show ✅

- [ ] Your PyPI package page (before deletion)
- [ ] List of versions before deletion
- [ ] The workflow running (`npm start`)
- [ ] Console output showing:
  - Navigation to PyPI
  - Finding oldest version
  - Deletion in progress
  - Success message
- [ ] PyPI package page (after deletion)
- [ ] Confirmation that oldest version is gone

### Good to Include ⭐

- [ ] The `.env` configuration (hide sensitive data)
- [ ] Browser automation in action (if visible)
- [ ] The version being deleted highlighted
- [ ] Workflow state output at the end
- [ ] Quick look at the code structure

### Optional 💡

- [ ] Dry-run demonstration first
- [ ] Explanation of how it works
- [ ] GitHub Actions integration mention
- [ ] Use case explanation

## Sample Script

Here's a sample narration script:

---

**[0:00 - Introduction]**

"Hi, this is [Your Name]. I'm demonstrating the TypeScript workflow I created for issue #357, which automatically deletes the oldest version of a PyPI package."

**[0:15 - Show Current State]**

"First, let's look at my test package on PyPI. As you can see, I have 5 versions published: 0.1.0, 0.1.1, 0.2.0, 0.2.1, and 0.3.0. The oldest version here is 0.1.0, which we'll be deleting."

**[0:45 - Configuration]**

"I've configured the workflow with my PyPI credentials and package name in the .env file. I'm using an API token for authentication."

**[1:00 - Run Workflow]**

"Now let's run the workflow with npm start. The workflow has three main steps: navigate to PyPI, find the oldest version, and delete it."

**[1:15 - Step 1]**

"Step 1: It's navigating to the PyPI management page and logging in..."

**[1:45 - Step 2]**

"Step 2: It's extracting all version numbers from the page and identifying version 0.1.0 as the oldest..."

**[2:15 - Step 3]**

"Step 3: Now it's clicking through the delete option and confirming the deletion..."

**[2:45 - Success]**

"Great! The workflow completed successfully. It identified and deleted version 0.1.0."

**[3:00 - Verify]**

"Let's verify by refreshing the PyPI page. As you can see, version 0.1.0 is now gone. We now have 4 versions instead of 5."

**[3:20 - Conclusion]**

"This workflow is now integrated into the GitHub Actions CI pipeline, so it runs automatically before each PyPI publish to prevent hitting the version limit. Thanks for watching!"

---

## Recording Settings

### Video Quality
- **Resolution**: 1920x1080 (1080p) minimum
- **Frame rate**: 30 fps
- **Format**: MP4, MOV, or WebM
- **Bitrate**: 5-10 Mbps

### Audio (if narrating)
- Use a decent microphone
- Record in a quiet environment
- Speak clearly and at moderate pace
- Edit out long pauses or errors

### Screen Capture
- Use high DPI scaling if available
- Increase terminal font size for readability
- Use a clean desktop background
- Close unnecessary applications/tabs

## Recommended Tools

### Screen Recording
- **OBS Studio** (Free, Windows/Mac/Linux) - Most flexible
- **QuickTime** (Free, Mac) - Simple and built-in
- **ShareX** (Free, Windows) - Feature-rich
- **Xbox Game Bar** (Free, Windows) - Built-in
- **Loom** (Free tier available) - Cloud-based, easy sharing

### Video Editing
- **DaVinci Resolve** (Free) - Professional features
- **OpenShot** (Free) - User-friendly
- **iMovie** (Free, Mac) - Simple and effective
- **Shotcut** (Free) - Cross-platform

### Terminal Themes (for better readability)
- Use a high-contrast theme
- Larger font size (14-16pt)
- Popular themes: Dracula, Monokai, Solarized Dark

## Upload and Share

### Video Hosting Options
1. **YouTube** (recommended)
   - Upload as unlisted if you prefer
   - Add to issue comment

2. **GitHub** (if video < 10MB)
   - Upload directly to issue

3. **Google Drive / Dropbox**
   - Share link in issue comment

4. **Vimeo**
   - Professional presentation

### In the Issue Comment

Include:
- Link to the video
- Brief description
- Mention the PR number
- Note any important details

Example:
```markdown
## Video Demo

Here's a video demonstration of the workflow in action:
[Video Link]

The demo shows:
- Current PyPI package state with 5 versions
- Workflow execution deleting the oldest version (0.1.0)
- Verification that the version was successfully removed

Package used: [your-test-package]
PR: #[PR-NUMBER]
```

## Tips for a Great Demo

✅ **Do:**
- Test everything before recording
- Use a clean terminal with no history
- Speak clearly if narrating
- Show the full workflow from start to finish
- Verify the deletion actually worked
- Use your own PyPI account (as required)
- Keep it concise (2-5 minutes)

❌ **Don't:**
- Show your actual PyPI API token
- Rush through important steps
- Use poor video quality
- Include long silent pauses
- Forget to show the "after" state
- Use someone else's account

## Troubleshooting

### Issue: Workflow fails during recording
**Solution**: Do a dry run first (`DRY_RUN=true`) to test everything

### Issue: Poor video quality
**Solution**: Check recording settings, use 1080p minimum

### Issue: Audio not clear
**Solution**: Use a better mic or add subtitles/captions

### Issue: Video too long
**Solution**: Edit out waiting periods, speed up slow parts

### Issue: PyPI UI looks different
**Solution**: This is actually good - shows the workflow adapts to UI changes!

## After Recording

1. **Review the video**
   - Check audio/video quality
   - Ensure all steps are visible
   - Verify no sensitive info is shown

2. **Edit if needed**
   - Trim unnecessary parts
   - Add intro/outro text
   - Speed up slow sections
   - Add captions if helpful

3. **Upload and share**
   - Choose a platform
   - Set appropriate privacy settings
   - Copy the link

4. **Post to issue #357**
   - Add video link
   - Brief description
   - Mention PR number

## Questions?

If you have questions about the video demo:
- Review this guide
- Check the issue #357 requirements
- Look at the workflow documentation
- Test the workflow thoroughly first

---

**Good luck with your recording!** 🎥🚀
