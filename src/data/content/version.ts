/**
 * Bump whenever any content file changes: the app re-seeds content tables on next launch
 * (learner data is preserved). Kept in its own tiny module so app startup does not have to
 * load the whole curriculum just to compare versions.
 */
export const CONTENT_VERSION = 3;
