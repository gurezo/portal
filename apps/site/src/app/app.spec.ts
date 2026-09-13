import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { PROJECTS } from './projects/projects.data';
import { featuredProject, projectLink } from './projects/projects.util';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should have the configured title', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance['title']).toBe('gurezo portal site');
  });

  it('renders project metadata instead of hardcoded listing copy', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const featured = featuredProject(PROJECTS);
    const docsLink = featured ? projectLink(featured, 'docs') : undefined;
    const githubLink = PROJECTS[0]?.links.find((link) => link.kind === 'github');

    expect(featured).toBeDefined();
    expect(docsLink).toBeDefined();
    expect(githubLink).toBeDefined();

    const docsAnchors = Array.from(
      compiled.querySelectorAll(`a[href="${docsLink?.url}"]`),
    );

    expect(
      docsAnchors.some((anchor) =>
        anchor.textContent?.includes(`view ${featured?.name}`),
      ),
    ).toBe(true);
    expect(
      docsAnchors.some((anchor) =>
        anchor.textContent?.includes('Documentation'),
      ),
    ).toBe(true);

    expect(compiled.textContent).toContain(featured?.packageName ?? '');
    expect(compiled.textContent).toContain(PROJECTS[0].description);
    expect(
      compiled.querySelector(`a[href="${githubLink?.url}"]`)?.textContent,
    ).toContain('GitHub');
  });

  it('renders Libraries and CHIRIMEN Tools as separate groups', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const libraries = compiled.querySelector(
      '[aria-labelledby="libraries-heading"]',
    );
    const chirimenTools = compiled.querySelector(
      '[aria-labelledby="chirimen-tools-heading"]',
    );
    const librariesHeading = compiled.querySelector('#libraries-heading');
    const chirimenHeading = compiled.querySelector('#chirimen-tools-heading');

    expect(librariesHeading?.textContent?.trim()).toBe('Libraries');
    expect(chirimenHeading?.textContent?.trim()).toBe('CHIRIMEN Tools');
    expect(libraries?.textContent).toContain('web-serial-rxjs');
    expect(libraries?.textContent).not.toContain('Coming later');
    expect(libraries?.textContent).not.toContain('CHIRIMEN Lite Console');
    expect(chirimenTools?.textContent).toContain('CHIRIMEN Lite Console');
    expect(chirimenTools?.textContent).toContain('Web Application');
    expect(chirimenTools?.textContent).not.toContain('Coming later');
    expect(chirimenTools?.querySelector('app-project-card')).not.toBeNull();
    expect(
      chirimenTools?.querySelector(
        'a[href="https://chirimen-lite-console.web.app/"]',
      )?.textContent,
    ).toContain('Open App');
    expect(
      chirimenTools?.querySelector(
        'a[href="https://github.com/gurezo/chirimen-lite-console"]',
      )?.textContent,
    ).toContain('GitHub');
  });
});
