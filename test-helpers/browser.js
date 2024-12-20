/* eslint-env node */
/* globals browserOptions */

import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';

class Browser {
  constructor() {
    this.context = null;
    this.page = null;
    this.options = {};
  }

  getOptions() {
    return {
      headless: true,
      args: [
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list',
        `--window-size=${this.options.windowWidth || 1366},${this.options.windowHeight || 768}`
      ],
      ...this.options
    };
  }

  async launchAndGo(url, options = browserOptions) {
    this.options = options;
    this.context = await puppeteer.launch(this.getOptions());
    this.page = await this.context.newPage();

    await this.page.setViewport({
      width: this.options.windowWidth || 1366,
      height: this.options.windowHeight || 768
    });
    await this.page.goto(url, {waitUntil: 'networkidle2'});
  }

  async close() {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }

    if (this.context) {
      await this.context.close();
      this.context = null;
    }
  }

  async audit() {
    if (this.context && this.page) {
      const lhr = await lighthouse(this.page.url(), {
        port: (new URL(this.context.wsEndpoint())).port,
        output: 'json',
        logLevel: false
      });

      return {
        accessibility: lhr.lhr.categories.accessibility.score * 100,
        performance: lhr.lhr.categories.performance.score * 100,
        pwa: lhr.lhr.categories.pwa.score * 100,
        bestPractices: lhr.lhr.categories['best-practices'].score * 100,
        seo: lhr.lhr.categories.seo.score * 100,
        pageSpeed: lhr.lhr.audits['speed-index'].score * 100
      };
    }
  }

  async waitForResponseAndGetJson(includes) {
    const response = await this.page.waitForResponse((response) => response.url().includes(includes));
    return await response.json();
  }

  async getInputValue(selector) {
    return await this.page.evaluate((selector) => document.querySelector(selector).value, selector);
  }

  async fillInput(selector, value, clear = true) {
    if (clear) {
      return await this.page.evaluate((selector, value) => document.querySelector(selector).value = value, selector, value);
    }

    await this.page.type(selector, value);
  }
}

export default Browser;
