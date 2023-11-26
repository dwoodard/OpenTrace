import OpenTrace from '../src/content/OpenTrace.js';
import { assert, expect } from 'chai';
import e from 'express';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;

describe('OpenTrace', () => {

  beforeEach(() => {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
    global.MutationObserver = dom.window.MutationObserver;
    global.Node = window.Node;
  });



  describe('Constructor and Initial Analysis', () => {
    // Analyze the page when the class is instantiated
    it('should initialize and analyze the page', () => {
      const openTrace = new OpenTrace();
      console.log("Final contacts:", Array.from(openTrace.data.contacts.values()));

      // Additional assertions to check the initial state
      assert.isObject(openTrace);
    });

  });

  describe('extractData', () => {
    it('should extract data correctly from DOM nodes', () => {
      document.body.innerHTML = `
            <div>
                <a href="mailto:foobar@example.com">foo bar</a> 
                <a href="tel:1234567890">1234567890</a>
            </div>
        `;
      const openTrace = new OpenTrace();
      openTrace.extractData(document.body);

      // log out contacts here
      console.log(openTrace.data.contacts);

      //  assert contacts
      // there should be 1 contact with 1 emails and 1 phone number
      assert.equal(openTrace.data.contacts.size, 1);
      const contact = openTrace.data.contacts.values().next().value;
      assert.equal(contact.emails.size, 1);
      assert.equal(contact.phoneNumbers.size, 1);

      // 
    });

    it('should find the correct ancestor for nested elements', () => {
      const ancestor = document.createElement('div');
      const child = document.createElement('div');
      const grandchild = document.createElement('div');

      document.body.appendChild(ancestor);
      ancestor.appendChild(child);
      child.appendChild(grandchild);

      const openTrace = new OpenTrace(); // Assuming OpenTrace class is imported
      const foundAncestor = openTrace.findClosestCommonAncestor(grandchild);

      expect(foundAncestor).to.equal(ancestor);
  });

    it('should have 2 contacts', () => {
      document.body.innerHTML = `
      <div>
        <div>
          <h1>Name: foo bar</h1>
          <p>foo bar - foobar@example.com</p>
          <p>1234567890</p>
        </div>
        <div>
          <h1>Biz bar</h1>
          <p>Biz bar - bizbar@example.com</p>
          <p>8884567890</p>
        </div>
      </div>
      `;

      const openTrace = new OpenTrace();
      openTrace.extractData(document.body);
      // console.log('contacts', openTrace.data.contacts);

      // should have 2 contacts
      assert.equal(openTrace.data.contacts.size, 2);

    });


  });

  describe('isAddress', () => {
    it('123 Main St, Anytown, USA', () => {
      const openTrace = new OpenTrace();
      const result = openTrace.isAddress("123 Main St, Anytown, USA");
      assert.isTrue(result);
    });

    it('123 Circle Ave, Anytown, USA', () => {
      const openTrace = new OpenTrace();
      const result = openTrace.isAddress("123 Circle Ave, Anytown, USA");
      assert.isTrue(result);
    });

    it('3e4r5t6y7u8i9o0p', () => {
      const openTrace = new OpenTrace();
      const result = openTrace.isAddress("3e4r5t6y7u8i9o0p");
      assert.isFalse(result);
    });

    it('should return false for an invalid address', () => {
      const openTrace = new OpenTrace();
      const result = openTrace.isAddress("Not an address");
      assert.isFalse(result);
    });

    // Additional tests...
  });



});