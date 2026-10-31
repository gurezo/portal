import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, UrlSerializer } from '@angular/router';
import { appRoutes } from './app.routes';
import { StripTrailingSlashUrlSerializer } from './strip-trailing-slash-url-serializer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    { provide: UrlSerializer, useClass: StripTrailingSlashUrlSerializer },
  ],
};
