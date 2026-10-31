import { DefaultUrlSerializer, UrlTree } from '@angular/router';

export class StripTrailingSlashUrlSerializer extends DefaultUrlSerializer {
  override parse(url: string): UrlTree {
    const normalized = url.replace(/\/+$/, '') || '/';
    return super.parse(normalized);
  }
}
