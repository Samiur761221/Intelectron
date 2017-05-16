import { IntelectronPage } from './app.po';

describe('intelectron App', () => {
  let page: IntelectronPage;

  beforeEach(() => {
    page = new IntelectronPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
