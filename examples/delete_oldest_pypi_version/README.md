# Delete Oldest PyPI Version Workflow

This TypeScript workflow automates the deletion of the oldest version of a PyPI package through the web UI. This is useful when you hit PyPI's version limit and need to clean up old releases before publishing new ones.

## Problem Statement

PyPI has a limit on the number of versions a package can have. When this limit is reached, new versions cannot be published. Since PyPI doesn't provide an API or CLI tool to delete versions, this must be done through the web interface.

## Solution

This workflow uses Terminator's UI automation capabilities to:
1. Navigate to the PyPI package management page
2. Login with credentials (if not already logged in)
3. Find and identify the oldest version
4. Delete that version through the UI

## Requirements

- Node.js 18+ and npm
- PyPI account with maintainer/owner access to the package
- PyPI credentials (username/password or API token)

## Environment Variables

The workflow requires the following environment variables:

- `PYPI_USERNAME`: Your PyPI username
- `PYPI_PASSWORD`: Your PyPI password (or API token)
- `PYPI_PACKAGE_NAME`: The name of the package (e.g., "terminator-py" or "terminator")

## Installation

```bash
cd examples/delete_oldest_pypi_version
npm install
```

## Usage

### Build the workflow

```bash
npm run build
```

### Run the workflow

```bash
# Set environment variables
export PYPI_USERNAME="your-username"
export PYPI_PASSWORD="your-password"
export PYPI_PACKAGE_NAME="your-package-name"

# Run the workflow
npm start
```

### Use in GitHub Actions

This workflow is integrated into the CI/CD pipeline. See `.github/workflows/ci-wheels.yml` for the integration.

The workflow will:
1. Check the current number of versions
2. If needed, delete the oldest version
3. Allow the publish step to proceed

## Package Names

This project publishes to two PyPI packages:
- `terminator-py`: The main Python package
- `terminator`: An alias/renamed version

Both may need version cleanup.

## Testing

To test this workflow safely:
1. Use your own PyPI test account
2. Create a test package with multiple versions
3. Run the workflow against your test package
4. Verify that the oldest version is deleted correctly

## Security Notes

- Never commit PyPI credentials to the repository
- Use GitHub Secrets for CI/CD integration
- API tokens are preferred over passwords
- Ensure the token/account has appropriate permissions

## Troubleshooting

- **Login fails**: Check credentials and ensure 2FA is properly configured
- **Version not found**: Verify the package name and that versions exist
- **Delete fails**: Ensure your account has maintainer/owner permissions
- **Element not found**: PyPI may have changed their UI - workflow may need updates

## Demo Video

A demonstration video showing the workflow in action will be provided as part of issue #357.
