# Chromatic Setup Guide

This guide explains how to set up automatic Storybook deployment to Chromatic using GitHub Actions.

## Overview

The GitHub Actions workflow (`chromatic.yml`) automatically:
- ✅ Builds and deploys Storybook to Chromatic on pushes to `master`
- ✅ Builds and deploys Storybook to Chromatic for PRs from [@RedHatInsights/experience-ui-committers](https://github.com/orgs/RedHatInsights/teams/experience-ui-committers) team members
- ✅ Builds and deploys Storybook to Chromatic for PRs from RedHatInsights organization admins
- ✅ Works with PRs from forks when submitted by team members or organization admins
- ✅ Blocks deployment for PRs from non-team members

## Required Setup

### 1. Chromatic Project Token

You need to add your Chromatic project token as a repository secret:

1. Go to [Chromatic](https://www.chromatic.com/) and find your project
2. Copy your project token from the project settings
3. In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Name: `CHROMATIC_PROJECT_TOKEN`
6. Value: Your Chromatic project token
7. Click **Add secret**

### 2. Team Permissions

The workflow checks if PR authors are members of the `@RedHatInsights/experience-ui-committers` team. Make sure:

- Team members have the appropriate permissions in the GitHub organization
- The team has read access to this repository (required for the membership check API)

## How It Works

### For Master Branch
- **Trigger**: Push to `master`
- **Action**: Automatically builds Storybook and deploys to Chromatic
- **No restrictions**: All pushes to master are deployed

### For Pull Requests
- **Trigger**: PR opened/updated targeting `master`
- **Permission Check**: Uses GitHub API to verify if PR author is a member of `@RedHatInsights/experience-ui-committers` or an organization admin
- **Team Members & Admins**: PRs from team members or organization admins are automatically deployed to Chromatic
- **Non-Team Members**: PRs are blocked from deployment
- **Forks**: Works for team members and organization admins even when submitting from forks

## Workflow Jobs

1. **`chromatic-deployment-push`**: Handles master branch deployments
2. **`check-permissions`**: Verifies team membership for PRs
3. **`chromatic-deployment-pr`**: Handles PR deployments for team members

## Troubleshooting

### Workflow Not Running
- Check that the workflow file is in `.github/workflows/chromatic.yml`
- Verify the target branch is `master` (adjust if your default branch is different)

### Permission Denied Errors
- Ensure `CHROMATIC_PROJECT_TOKEN` is correctly set in repository secrets
- Verify team membership API permissions

### PR from Fork Not Deploying
- Check if the PR author is a member of `@RedHatInsights/experience-ui-committers` or an organization admin
- Team membership must be public or visible to the organization
- Organization admin status must be visible

### Team Membership Check Failing
- The GitHub token used has permissions to read organization team memberships
- The team slug `experience-ui-committers` is correct

## Security Notes

- Uses `pull_request_target` for forks (runs in the context of the target repository)
- Only team members can trigger Chromatic deployments from PRs
- Secrets are only accessible to authorized workflows

## Customization

You can modify the workflow by editing `.github/workflows/chromatic.yml`:

- **Change target branch**: Modify `branches: [master]` sections
- **Change team**: Update `team_slug: 'experience-ui-committers'`
- **Add build options**: Modify the `chromaui/action` step parameters 