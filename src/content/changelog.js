// Release notes shown to supervisors after the app updates.
//
// Add a new entry at the top whenever the version in package.json is bumped.
// Keep this list cumulative: a supervisor jumping several releases sees every
// entry between their old version and the new one, so never delete old entries.
//
// Notes are bundled with the app rather than fetched, which guarantees a
// supervisor can never see notes that disagree with the code they are running.
export const CHANGELOG = [
  {
    version: '1.1.7',
    date: '2026-09-28',
    notes: [
      'Settings now has a "Check for updates" button that tells you when a new version is ready to install.',
      'The update reminder no longer disappears for the rest of the session after you dismiss it.',
      'You now see release notes like these each time the app updates.',
      'If an update ever gets stuck, Settings has a "Clear cache & reload" option.',
    ],
  },
  {
    version: '1.1.6',
    date: '2026-09-23',
    notes: [
      'Guideline and document review uploads are no longer capped at 10 MB. Students can now submit larger files, so expect bigger uploads than before.',
      'Reviewed documents can now be deleted, so a wrong submission can be corrected.',
    ],
  },
  {
    version: '1.1.5',
    date: '2026-09-10',
    notes: [
      'Students are now sorted by pending and overdue documents, with clearer visual status indicators.',
      'Refreshed the dashboard status chart with a new colour palette and improved layout.',
      'Documents that only contain comments are now supported and shown as comments-only.',
      'On iPhone and iPad, you are prompted to re-add the app from your home screen when the app icon changes.',
    ],
  },
];
