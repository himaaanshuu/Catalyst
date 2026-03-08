# Catalog Template Integration Checklist

## Done

- [x] Created a shared template source: `src/Library/catalogTemplates.js`
- [x] Added template metadata (`key`, `name`, `description`, `emoji`, `theme`)
- [x] Updated template gallery page to use shared template source
- [x] Added "Use This Template" action on each template card
- [x] Persisted template selection via `localStorage` (`selectedCatalogTemplate`)
- [x] Added register-page auto-open flow with `?start=register`
- [x] Added template selection UI in business creation form (`src/app/dashboard/business/page.js`)
- [x] Saved `template_key` while creating a business
- [x] Added template editing support in business edit modal
- [x] Displayed selected template badge on business cards in dashboard
- [x] Applied template-aware theming in public catalog page (`src/app/Catalog/[businessSlug]/page.js`)
- [x] Added DB migration script for `template_key`: `add_business_template_key.sql`

## Remaining

- [ ] Run `add_business_template_key.sql` in Supabase SQL editor
- [ ] Verify RLS policies permit updates/inserts on `template_key`
- [ ] Test end-to-end flow:
  - [ ] pick template in `/templates`
  - [ ] create business in `/dashboard/business?start=register`
  - [ ] open `/Catalog/[slug]` and verify theme applies
- [ ] Add visual regression snapshots for at least 2 templates
- [ ] Add unit/integration test coverage for `getTemplateByKey` fallback behavior
- [ ] Optionally add template preview thumbnails (real screenshots) instead of emojis
- [ ] Optionally support per-template layout variations (not only color theme)
