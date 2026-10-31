import { TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { appConfig } from './app.config';
import { StripTrailingSlashUrlSerializer } from './strip-trailing-slash-url-serializer';

describe('StripTrailingSlashUrlSerializer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...appConfig.providers],
    });
  });

  it('drops a trailing slash so /updates/ matches the updates route', () => {
    const serializer = TestBed.inject(UrlSerializer);

    expect(serializer).toBeInstanceOf(StripTrailingSlashUrlSerializer);
    expect(serializer.serialize(serializer.parse('/updates/'))).toBe('/updates');
    expect(serializer.serialize(serializer.parse('/'))).toBe('/');
    expect(serializer.serialize(serializer.parse('/updates'))).toBe('/updates');
  });
});
