import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

/**
 * Feature flags for staged feature disclosure.
 * @see docs/EXTERNAL_LINKS_AND_UPDATES_NAV.md for Updates nav enablement criteria
 */
export const FEATURE_FLAGS = {
  /**
   * Show Updates navigation item.
   * Only enable when stage ⑤ is complete:
   * - /updates route exists and returns 200
   * - RSS feed endpoint is available
   * - Content is ready for public access
   *
   * @default false
   */
  ENABLE_UPDATES_NAV: false,
} as const;

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(appRoutes)],
};
