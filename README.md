[![travis](https://img.shields.io/travis/locize/fluent_conv.svg)](https://travis-ci.org/locize/fluent_conv) [![npm](https://img.shields.io/npm/v/fluent_conv.svg)](https://npmjs.org/package/fluent_conv)

## Download

The source is available for download from
[GitHub](https://github.com/locize/fluent_conv/archive/master.zip).
Alternatively, you can install using npm:

```sh
npm install --save fluent_conv
```

You can then `require()` fluent_conv as normal:

```js
const fluent = require("fluent_conv");
```

Or you can direclty `require()` its functions:

```js
const ftl2js = require("fluent_conv/ftl2js");
```

## Usage

```js
const ftl = `
emails =
  { $unreadEmails ->
    [one] You have one unread email.
   *[other] You have { $unreadEmails } unread emails.
  }

-brand-name =
  {
   *[nominative] Firefox
    [accusative] Firefoxa
  }

-another-term = another term

app-title = { -brand-name }

restart-app = Zrestartuj { -brand-name[accusative] }.

# Note: { $title } is a placeholder for the title of the web page
# captured in the screenshot. The default, for pages without titles, is
# creating-page-title-default.
login = Predefined value
  .placeholder = example@email.com
  .aria-label = Login input value
  .title = Type your login email

logout = Logout
`;

const js = {
  emails:
    "{ $unreadEmails ->\n  [one] You have one unread email.\n *[other] You have { $unreadEmails } unread emails.\n}",
  "-brand-name": "{\n *[nominative] Firefox\n  [accusative] Firefoxa\n}",
  "-another-term": "another term",
  "app-title": "{ -brand-name }",
  "restart-app": "Zrestartuj { -brand-name[accusative] }.",
  login: {
    comment:
      "Note: { $title } is a placeholder for the title of the web page\ncaptured in the screenshot. The default, for pages without titles, is\ncreating-page-title-default.",
    val: "Predefined value",
    placeholder: "example@email.com",
    "aria-label": "Login input value",
    title: "Type your login email"
  },
  logout: "Logout"
};

const ftl2js = require("fluent_conv/ftl2js");
ftl2js(ftl, (err, res) => {
  // res is like js
});
// or
const res = ftl2js(ftl);
// res is like js


const js2ftl = require("fluent_conv/js2ftl");
js2ftl(js, (err, res) => {
  // res is like ftl
});
//or
const res = js2ftl(js);
// res is like ftl
```
