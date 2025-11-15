# Usage Guide - Delete Oldest PyPI Version Workflow

This guide provides detailed instructions on how to use the workflow locally and in CI/CD.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Testing](#local-testing)
3. [CI/CD Integration](#cicd-integration)
4. [Troubleshooting](#troubleshooting)
5. [How It Works](#how-it-works)

## Prerequisites

### Required Software

- **Node.js 18+** and npm
- **Terminator** browser automation library
- **Chrome or Chromium** browser (for web automation)

### Required Credentials

- PyPI account with maintainer/owner access to the package
- PyPI username and password/API token

### Getting PyPI API Token (Recommended)

1. Log in to [PyPI.org](https://pypi.org)
2. Go to Account Settings
3. Scroll to "API tokens"
4. Click "Add API token"
5. Choose scope (project-specific recommended)
6. Copy the token (starts with `pypi-`)

## Local Testing

### Step 1: Install Dependencies

```bash
cd examples/delete_oldest_pypi_version
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PYPI_USERNAME=__token__
PYPI_PASSWORD=pypi-your-api-token-here
PYPI_PACKAGE_NAME=your-package-name
DRY_RUN=false
```

**Note:** When using an API token, set `PYPI_USERNAME=__token__`

### Step 3: Build the Workflow

```bash
npm run build
```

### Step 4: Run the Workflow

**Using the test script (recommended):**

On Linux/Mac:
```bash
chmod +x test-workflow.sh
./test-workflow.sh
```

On Windows:
```powershell
.\test-workflow.ps1
```

**Or run directly:**

```bash
npm start
```

### Step 5: Testing with Dry Run

For safe testing without actually deleting:

```bash
export DRY_RUN=true
npm start
```

This will:
- Navigate to PyPI
- Login
- Identify the oldest version
- Stop before deletion

## CI/CD Integration

The workflow is integrated into `.github/workflows/ci-wheels.yml`.

### How It Works in CI

1. **Triggered on:** Version tags (e.g., `v1.0.0`) or manual workflow dispatch
2. **Before publishing:** Runs the cleanup workflow to delete the oldest version
3. **Then publishes:** New version to PyPI

### Required GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `PYPI_API_TOKEN` - For the `terminator-py` package
   - `TERMINATOR_PYPI_API_TOKEN` - For the `terminator` package

### CI Workflow Steps

The GitHub Actions workflow:

```yaml
- name: Setup Node.js for PyPI cleanup workflow
  uses: actions/setup-node@v4
  with:
    node-version: '20'

- name: Install and build PyPI cleanup workflow
  run: npm install && npm run build

- name: Delete oldest PyPI version (terminator-py)
  env:
    PYPI_USERNAME: __token__
    PYPI_PASSWORD: ${{ secrets.PYPI_API_TOKEN }}
    PYPI_PACKAGE_NAME: terminator-py
  run: npm start
  continue-on-error: true

- name: Publish to PyPI (terminator-py)
  # ... publish step
```

**Note:** `continue-on-error: true` ensures the publish step runs even if deletion fails.

## Troubleshooting

### Common Issues

#### 1. Login Fails

**Problem:** Cannot login to PyPI

**Solutions:**
- Verify your credentials are correct
- Check if you have 2FA enabled (may require additional handling)
- Try using an API token instead of password
- Ensure your account has access to the package

#### 2. Version Not Found

**Problem:** Workflow cannot find versions

**Solutions:**
- Verify the package name is correct
- Check if you're logged in to the right account
- Ensure the package has multiple versions
- PyPI UI might have changed - update selectors

#### 3. Delete Button Not Found

**Problem:** Cannot locate delete option

**Solutions:**
- PyPI may have updated their UI - check the HTML structure
- Ensure you have owner/maintainer permissions
- Try running with delays increased for slower connections

#### 4. Workflow Times Out

**Problem:** Workflow takes too long or hangs

**Solutions:**
- Check your internet connection
- Increase timeout values in step configs
- Verify PyPI.org is accessible
- Check if browser automation is working

### Debugging Tips

1. **Enable verbose logging:**
   ```typescript
   logger.debug("Detailed debug information");
   ```

2. **Add screenshots:**
   ```typescript
   await desktop.screenshot("debug-step-name.png");
   ```

3. **Check element selectors:**
   - Use browser DevTools to inspect PyPI page
   - Update selectors if PyPI UI changed

4. **Test with dry-run first:**
   ```bash
   export DRY_RUN=true
   npm start
   ```

### Getting Help

If you encounter issues:

1. Check the [README.md](README.md)
2. Review the workflow logs
3. Open an issue on GitHub with:
   - Error messages
   - Environment details (OS, Node version)
   - Steps to reproduce

## How It Works

### Architecture

The workflow consists of three main steps:

1. **Navigate & Login** (`01-navigate-to-pypi.ts`)
   - Opens browser to PyPI management page
   - Handles authentication if needed
   - Verifies successful navigation

2. **Find Oldest Version** (`02-find-oldest-version.ts`)
   - Extracts all version numbers from the page
   - Sorts versions semantically
   - Identifies the oldest version

3. **Delete Version** (`03-delete-version.ts`)
   - Locates the delete option for the oldest version
   - Clicks through confirmation dialogs
   - Verifies deletion succeeded

### Technology Stack

- **TypeScript**: Type-safe workflow definitions
- **@mediar-ai/workflow**: Workflow orchestration framework
- **@mediar-ai/terminator**: UI automation engine
- **Zod**: Input validation and schemas

### Workflow State

State is passed between steps:

```typescript
{
  packageName: "terminator-py",
  loggedIn: true,
  oldestVersion: "0.1.0",
  totalVersions: 50,
  deletedVersion: "0.1.0",
  deletionTimestamp: "2024-01-15T10:30:00Z"
}
```

### Safety Features

1. **Input validation** - All inputs validated with Zod schemas
2. **Error recovery** - Steps have error handlers
3. **Dry-run mode** - Test without making changes
4. **Confirmation dialogs** - PyPI requires confirmation before deletion
5. **Continue-on-error** - CI pipeline continues even if cleanup fails

## Best Practices

1. **Test locally first** - Always test with your own PyPI account
2. **Use API tokens** - More secure than passwords
3. **Monitor CI logs** - Check if cleanup is working
4. **Keep versions reasonable** - Don't rely solely on this workflow
5. **Document package versions** - Know what versions you have

## Performance

- **Average execution time**: 30-60 seconds
- **Network dependent**: Requires stable connection to PyPI
- **Browser automation**: Runs in headless mode in CI

## Security Considerations

- **Credentials**: Never commit credentials to repository
- **GitHub Secrets**: Use for CI/CD credentials
- **API Tokens**: Prefer tokens over passwords
- **Scope Tokens**: Use project-specific tokens when possible
- **Audit Logs**: PyPI maintains logs of deletions

## Future Improvements

Potential enhancements:

- [ ] Support for deleting multiple old versions
- [ ] Version selection criteria (by date, pattern, etc.)
- [ ] Email notification on deletion
- [ ] Retry logic for flaky network
- [ ] Support for TestPyPI
- [ ] Parallel deletion for multiple packages
