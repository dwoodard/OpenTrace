
I want to create a JavaScript class named DataFinder that automatically monitors web page content for specific types of data, such as phone numbers and email addresses. I want it to be modular for example if I'm looking for a phone number i can use the phone number function that will contain a list of checks for a phone, or if I'm looking for an email address i can just use the email address function.

It will do check first to find the data and then run through a clean up function to make sure the data is in the correct format.


Here's a summary of its functionality:

Observe DOM Changes: The class sets up an observer that watches for any changes in the webpage's Document Object Model (DOM), which is the structure of the content on a webpage. This is particularly useful for dynamically loaded content, where new data might appear after the initial page load.

Lets define where all the data is going to be stored. I think it would be best to store it in an Set of objects. Each object will have the data type, the value of the data, and the element that the data was found in.

```js
let data = [
    {
        type: 'phone',
        value: '555-555-5555',
        element: [Reference to the DOM element]
        timestamp: epoch time
    }
]
```


Handling Varying HTML Structures:
The class is designed to work with a wide variety of HTML structures. It doesn't require any specific HTML structure, but it does require that the data to be extracted is contained within a common parent element. For example, if the data to be extracted is a list of contacts, then each contact should be contained within a common parent element. This allows the class to monitor changes to the common parent element and then scan the child elements for the data to be extracted.

The challenges with this are some elements will have a common parent element and some will not. So we need to be able to check for the common parent element and if it doesn't have one we need to be able to check for the data type with out it. I think functions will be the best way to do this.

but the idea is take any given element and do checks on it certain things like a element Analysis function that will check the element for certain things like:
  - a common parent element
  - data type
  - depth of the element to body
  - class names of the element
  - siblings structure
  - filter out elements that don't have the data type we're looking for
  - check for a common parent element
  - check for a common parent element class name
  - check for a common parent element id

Example of this function:
```js
function elementAnalysis(element) {
  const analysisResult = {
    commonParent: null,
    commonParentClassName: null,
    commonParentId: null,
    dataType: null,
    depthToBody: null,
    classNames: [],
    siblings: {
      previous: null,
      next: null,
    },
    shouldFilterOut: false,
  };

  // Check for a common parent element
  const commonParent = getCommonParentElement(element);
  if (commonParent) {
    analysisResult.commonParent = commonParent;
    analysisResult.commonParentClassName = commonParent.className;
    analysisResult.commonParentId = commonParent.id;
  }

  // Check for data type using your regular expressions
  for (const dataType in dataFinder.dataTypes) {
    const pattern = dataFinder.dataTypes[dataType];
    if (pattern.test(element.textContent) || pattern.test(element.innerHTML)) {
      analysisResult.dataType = dataType;
      break;
    }
  }

  // Calculate depth of the element to body
  let depth = 0;
  let currentElement = element;
  while (currentElement !== document.body) {
    depth++;
    currentElement = currentElement.parentElement;
  }
  analysisResult.depthToBody = depth;

  // Extract class names of the element
  analysisResult.classNames = Array.from(element.classList);

  // Determine siblings structure
  const previousSibling = element.previousElementSibling;
  const nextSibling = element.nextElementSibling;
  if (previousSibling) {
    analysisResult.siblings.previous = {
      tagName: previousSibling.tagName,
      classNames: Array.from(previousSibling.classList),
    };
  }
  if (nextSibling) {
    analysisResult.siblings.next = {
      tagName: nextSibling.tagName,
      classNames: Array.from(nextSibling.classList),
    };
  }

  // Filter out elements that don't have the data type you're looking for
  analysisResult.shouldFilterOut = !analysisResult.dataType;

  // Return the analysis result
  return analysisResult;
}

```

Part of the challenge is going to be how to check for a common parent element. How would you do this?

What is a common parent element and what is not a common parent element?
A common parent element is the parent element of the a repeated pattern.

In vue.js for example you might have this:
```html
<div>
  <div class='commonParent'>
    <div class="contact" v-for="contact in contacts">
      <h3 class="name">{{ contact.name }}</h3>
      <div class="details">
        <p class="email">{{ contact.email }}</p>
        <p class="phone">{{ contact.phone }}</p>
        <p class="address">{{ contact.address }}</p>
      </div>
    </div>
</div>
```

to contrast this with a non common parent element you might have this:
```html
<div>
  <div class="contact"> <!-- this is the common parent parent of this data but it doesn't repeat -->
    <h3 class="name">{{ contact.name }}</h3>
    <div class="details">
      <p class="email">
        <a href="mailto:{{ contact.email }}">{{ contact.email }}</a>
      </p>
      <p class="phone">
        <a href="tel:{{ contact.phone }}">{{ contact.phone }}</a>
      </p>
      <p class="address">
        <a href="https://maps.google.com/?q={{ contact.address }}">{{ contact.address }}</a>
      </p>
    </div>
  </div>
</div>
```


Its as though we are trying to reconstruct contacts in reverse.

In order to do this we need to know:
  - the common parent element
   - We know we have this when we have a repeated pattern


```js
function getCommonParentElement(element) {
  


  // check for a common parent element
  // check for a common parent element class name
  // check for a common parent element id

  // return the common parent element
}
```




Say the dom load with this structure:

```html
<div>
  <div class='commonParent'>
    <div class="contact">
      <h3 class="name">Joe</h3>
      <div class="details">
        <p class="email">joe@website.net</p>
        <p class="phone">(555) 801-6789</p>
        <p class="address">582 N Main St, Clearfield, UT 84015</p>
      </div>
    </div>
    <div class="contact">
      <h3 class="name">Alice Johnson</h3>
      <div class="details">
        <p class="email">alice@example.com</p>
        <p class="phone">(555) 123-4567</p>
      </div>
    </div>
    <div class="contact">
      <h3 class="name">Bob Williams</h3>
      <div class="details">
        <p class="email">bob@sample.org</p>
        <p class="phone">(555) 234-5678</p>
      </div>
    </div>
    <div class="contact">
      <h3 class="name">Carol Thomas</h3>
      <div class="details extra">
        <p class="email">carol@website.net</p>
        <p class="phone">(555) 345-6789</p>
        <p class="address">123 Main St, Anytown, USA</p>
      </div>
    </div>
  </div>
</div>
```

the Observer will watch for any changes.

Example of changes:
mutation will give the element that was changed


Now not every site is going to have a well defined structure like this. But we need to use what every we can about the page with out know what is in the page first. it must GO WITH OUT OR FIGURE IT OUT


This will give us the element, and for each element we can check 2 parts to it, the TextContent (the text inside the element) html which will have possible hints to help define the data type
example of html hints:
<a href="tel:555-555-5555">555-555-5555</a> this is a phone number
<a href="mailto:foo@example.com">joe smith</a> this is an email address
<a href="https://www.example.com">website</a> this is a website
<a href="https://twitter.com/username">@username</a>
<a href="https://www.facebook.com/username">username</a>
<div class="username">username</div>
<div class="address">123 main st</div>
<div class="city">city</div>
<div class="state">state</div>
<div class="zip">zip</div>

Example of TextContent:
```html
555-555-5555
foo@exmaple.com
joe smith
website
@username
username
123 main st
city
state (2 letter abbreviation) it would be nice to have a list of all the states and their abbreviations for a quick check
zip  (5 digit zip code)
```

Each of these (being The TextContent and HTML) will be checking each element so any way of filtering out the elements that don't have the data type we're looking for would be helpful.

Modular Data Patterns: The class is designed to identify specific types of data based on regular expressions. For example, it has patterns defined for recognizing phone numbers and email addresses. These patterns can be modified or expanded to include other types of data.

once we recognize the data, we add the element to a list of elements that have the data type we're looking for.

Example of keeping track of the elements that have the data type we're looking for:
[
    {
        type: 'phone',
        value: '555-555-5555',
        element: [Reference to the DOM element]
    },
    {
        type: 'email',
        value: 'foo@test.com',
        element: [Reference to the DOM element]
    }
]






Extract Data from the DOM: Whenever a change is detected in the DOM, the code scans all elements on the page to find text that matches the defined patterns. This extraction is done using regular expressions, which are powerful tools for text pattern matching.

Collect and Log Extracted Data: The extracted data (phone numbers and emails in this case) are collected into an array. Each piece of data is stored as an object containing the type of data (like 'phone' or 'email'), the actual value of the data, and the DOM element where this data was found.

In essence, this DataFinder class is a tool for automatic data extraction from a webpage, focusing on specific types of data defined by regular expressions. It's particularly useful for scenarios where the webpage content changes dynamically and there's a need to capture specific information from it.
