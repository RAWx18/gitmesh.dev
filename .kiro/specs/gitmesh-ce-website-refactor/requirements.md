# Requirements Document

## Introduction

This document outlines the requirements for refactoring and completing the GitMesh Community Edition website as a code-first, open-source friendly, Vercel-deployable site. The website serves as the official Community Edition information hub, documentation portal, and admin-controlled publishing surface for GitMesh CE, which operates as a lab under Linux Foundation Decentralized Trust (LFDT) and is hosted by Alveoli for community welfare.

## Requirements

### Requirement 1: Platform and Deployment

**User Story:** As a project maintainer, I want the website to be deployable on Vercel with Next.js App Router, so that we have a reliable, scalable hosting solution without server dependencies.

#### Acceptance Criteria

1. WHEN the website is deployed THEN it SHALL use Next.js with App Router
2. WHEN deploying THEN the system SHALL be compatible with Vercel's deployment constraints
3. WHEN running THEN the system SHALL NOT require server-dependent cron jobs outside Vercel + GitHub Actions support
4. WHEN configured THEN the system SHALL NOT use any commercial or SaaS headless CMS (no Netlify CMS, Strapi, Sanity, Contentful, etc.)
5. WHEN implemented THEN all content management SHALL be repo-based or self-hostable OSS

### Requirement 2: Documentation System Migration

**User Story:** As a user seeking documentation, I want the docs to be migrated from GitBook to an open-source system, so that the documentation is versionable and lives in the repository.

#### Acceptance Criteria

1. WHEN migrating docs THEN the system SHALL use one of: Docusaurus, Nextra (MDX-based), or MkDocs Material
2. WHEN docs are migrated THEN they SHALL live in the repository and be versionable
3. WHEN accessing docs THEN they SHALL be searchable and accessible
4. WHEN deployed THEN docs SHALL be deployed with the main site on Vercel
5. WHEN migrating THEN the system SHALL preserve existing structure, URLs where possible, and versioning capability

### Requirement 3: Content Preservation and Governance

**User Story:** As a community member, I want the GitMesh Community Governance section to remain unchanged, so that governance information is preserved accurately.

#### Acceptance Criteria

1. WHEN refactoring THEN the "GitMesh Community Governance" section SHALL remain unchanged
2. WHEN preserving content THEN the formatting and links SHALL be preserved verbatim
3. WHEN updating navigation THEN existing top-navbar links SHALL NOT be removed or reordered
4. WHEN displaying LFDT mentions THEN each SHALL include a small info badge with tooltip stating: "LF Decentralized Trust governs the GitMesh CE GitHub repository. This website is hosted by Alveoli for community welfare and is not hosted or operated by LFDT."

### Requirement 4: Enterprise Edition Clarification

**User Story:** As a visitor, I want clear information about the relationship between Community and Enterprise editions, so that I understand the different offerings.

#### Acceptance Criteria

1. WHEN visiting the site THEN it SHALL clearly state: "The GitMesh Enterprise Edition is built, hosted, and supported by Alveoli"
2. WHEN reading about GitMesh THEN the site SHALL explain the relationship between Alveoli and GitMesh CE
3. WHEN accessing information THEN it SHALL be clear this is GitMesh Community Edition, not the Enterprise product site

### Requirement 5: Core Content and Messaging

**User Story:** As a visitor, I want to understand what GitMesh CE is and see community testimonials, so that I can evaluate the platform's value.

#### Acceptance Criteria

1. WHEN viewing the product description THEN it SHALL use the exact text: "GitMesh correlates market signals with engineering telemetry to auto-generate ranked backlogs, sprint plans, and work routing — fully synced across your dev stack..."
2. WHEN viewing testimonials THEN the system SHALL display all 9 provided testimonials with exact quotes and attributions
3. WHEN reading about the project THEN the site SHALL include the complete origin story with proper sections and links
4. WHEN viewing maintainers THEN it SHALL list: Ryan Madhuwala (creator), Ronit Raj, and Parv Mittal

### Requirement 6: Admin System and Content Management

**User Story:** As an admin, I want a secure admin interface to manage blog posts, vlogs, and newsletters, so that I can publish content without technical barriers.

#### Acceptance Criteria

1. WHEN implementing admin access THEN it SHALL use Google OAuth only
2. WHEN checking admin permissions THEN allowed admins SHALL come from environment variable: GITMESH_CE_ADMIN_EMAILS
3. WHEN accessing admin features THEN all checks SHALL be server-side
4. WHEN navigating THEN the admin UI SHALL NOT be exposed in the navbar
5. WHEN accessing admin THEN the entry point SHALL be a footer-only "Super Admin" button
6. WHEN using admin dashboard THEN it SHALL support: create/edit/delete blog posts, add vlogs (YouTube/Vimeo embeds), manage admin email allowlist, send newsletters, view contributor sync logs, trigger manual contributor refresh, view site diagnostics

### Requirement 7: Newsletter System

**User Story:** As a community member, I want to subscribe to newsletters and receive updates about blog posts, so that I stay informed about GitMesh CE developments.

#### Acceptance Criteria

1. WHEN implementing newsletter THEN it SHALL use OSS-friendly implementation with email provider via env (SendGrid/SES)
2. WHEN subscribing THEN the system SHALL provide double opt-in functionality
3. WHEN managing newsletters THEN it SHALL support tag-based targeting
4. WHEN publishing blogs THEN it SHALL offer optional newsletter send
5. WHEN storing data THEN it SHALL be GDPR-safe (email + consent timestamp)

### Requirement 8: Contributor Automation

**User Story:** As a maintainer, I want contributor information to be automatically synced daily, so that the website reflects current project contributors accurately.

#### Acceptance Criteria

1. WHEN running daily sync THEN it SHALL fetch: https://github.com/LF-Decentralized-Trust-labs/gitmesh/blob/main/governance/contributors.yaml
2. WHEN processing data THEN it SHALL parse YAML and store normalized data in /data/contributors.json
3. WHEN updating THEN it SHALL commit updates automatically via GitHub Action
4. WHEN syncing THEN it SHALL generate a daily diff summary
5. WHEN checking status THEN the last sync status SHALL be exposed in Admin dashboard
6. WHEN failures occur THEN it SHALL retry with backoff, log failures, and show visible admin alerts

### Requirement 9: Design and User Experience

**User Story:** As a visitor, I want a clean, accessible website design that reuses existing components, so that I have a pleasant browsing experience.

#### Acceptance Criteria

1. WHEN designing THEN it SHALL use clean, flat, non-gradient UI
2. WHEN choosing colors THEN it SHALL use a neutral palette
3. WHEN implementing THEN it SHALL reuse existing components without deleting them
4. WHEN improving THEN it SHALL focus on semantics, spacing, and accessibility over visual noise
5. WHEN building THEN it SHALL follow clean, accessible design principles

### Requirement 10: Rybbit Integration and Site Diagnostics

**User Story:** As an admin, I want basic site diagnostic tools, so that I can monitor website health and performance.

#### Acceptance Criteria

1. WHEN implementing Rybbit THEN it SHALL add a minimal button in footer or admin tools area
2. WHEN running diagnostics THEN it SHALL check: broken links, missing metadata, sitemap validity, Lighthouse placeholder scores
3. WHEN storing results THEN they SHALL be viewable in Admin dashboard
4. WHEN implementing THEN it SHALL use OSS implementation with internal API

### Requirement 11: Git-based Content Management

**User Story:** As an admin, I want content to be managed through Git, so that all changes are version-controlled and transparent.

#### Acceptance Criteria

1. WHEN storing content THEN it SHALL use Markdown/MDX stored in /content directory
2. WHEN publishing THEN admin UI SHALL commit directly to GitHub via GitHub App or fine-scoped token
3. WHEN managing content THEN it SHALL support PR-based publishing OR direct commits to protected branch
4. WHEN implementing THEN it SHALL NOT use external CMS services
5. WHEN managing THEN all content changes SHALL be tracked in Git history