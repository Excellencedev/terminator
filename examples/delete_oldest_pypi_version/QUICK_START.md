# Quick Start Guide

Get the workflow running in 5 minutes! ⚡

## Prerequisites

- Node.js 18+ installed
- PyPI account with a test package
- Chrome/Chromium browser

## Installation (30 seconds)

```bash
cd examples/delete_oldest_pypi_version
npm install
```

## Configuration (1 minute)

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PYPI_USERNAME=__token__
PYPI_PASSWORD=pypi-your-api-token-here
PYPI_PACKAGE_NAME=your-test-package
DRY_RUN=false
```

**Get PyPI Token:** [https://pypi.org/manage/account/token/](https://pypi.org/manage/account/token/)

## Build (10 seconds)

```bash
npm run build
```

## Test Run (Dry Run - Safe) (30 seconds)

```bash
export DRY_RUN=true
npm start
```

This will:
- ✅ Login to PyPI
- ✅ Find oldest version
- ❌ NOT delete (dry run)

## Live Run (2 minutes)

```bash
export DRY_RUN=false
npm start
```

This will:
- ✅ Login to PyPI
- ✅ Find oldest version  
- ✅ Delete oldest version

## Using Test Scripts

### Linux/Mac

```bash
chmod +x test-workflow.sh
./test-workflow.sh
```

### Windows

```powershell
.\test-workflow.ps1
```

## Expected Output

```
🚀 Starting Delete Oldest PyPI Version Workflow...

📦 Package: terminator-py
👤 Username: __token__
🔒 Password: ********************

🌐 Opening PyPI package management page...
✅ Successfully navigated to package management page

🔍 Finding the oldest version...
Found 45 versions: 0.1.0, 0.1.1, 0.2.0, ...
🎯 Identified oldest version: 0.1.0

🗑️ Deleting oldest version...
✅ Successfully deleted version 0.1.0

============================================================
📊 Workflow Result:
============================================================
Status: success
✅ Workflow completed successfully!

📝 Final State:
   Package: terminator-py
   Total Versions Found: 45
   Oldest Version: 0.1.0
   Deleted Version: 0.1.0
   Deletion Time: 2024-01-15T10:30:00Z
============================================================
```

## Troubleshooting

### "Login failed"
- Check your token is valid
- Use `__token__` as username with API tokens

### "Version not found"
- Ensure your package has multiple versions
- Check the package name is correct

### "Element not found"
- PyPI UI may have changed
- Check internet connection

## CI/CD Usage

The workflow is already integrated in `.github/workflows/ci-wheels.yml`:

- Runs automatically before PyPI publish
- Uses GitHub Secrets for credentials
- Continues on error (won't block publish)

## Next Steps

1. ✅ Test locally with your own PyPI package
2. ✅ Verify it deletes the correct version
3. ✅ Record a demo video (if needed for bounty)
4. ✅ Set up GitHub Secrets for CI
5. ✅ Deploy to production

## Support

- Full docs: [README.md](README.md)
- Usage guide: [USAGE_GUIDE.md](USAGE_GUIDE.md)
- Implementation: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

## Video Recording Tips

To create the demo video for issue #357:

1. **Setup screen recording** (OBS, QuickTime, etc.)
2. **Show terminal** with the workflow running
3. **Split screen** to show PyPI page
4. **Narrate** what's happening (optional)
5. **Show before/after** version counts
6. **Duration**: 2-3 minutes is perfect

---

**Ready in under 5 minutes!** 🚀
