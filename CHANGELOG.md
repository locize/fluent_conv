### 3.3.4

- `js2ftl`: a line of a multiline value that starts with `[`, `*` or `.` (also after spaces) is written as `{"*"}`…, so bullet lists and `[note]` lines no longer cut off the rest of the value; the variants of a selector (`[one]`, `*[other]` inside `{ … }`) stay as they are ([#9](https://github.com/locize/fluent_conv/pull/9), by [@Pharex38](https://github.com/Pharex38))

### 3.3.3

- `ftl2js`: string literal placeables keep their source form (`{"{"}`, `{"\""}`, `{"   "}`), so escaped braces and quotes, Unicode escapes and leading spaces survive a round trip; they used to come out as bare text that Fluent reads differently ([#8](https://github.com/locize/fluent_conv/pull/8), by [@Pharex38](https://github.com/Pharex38))

### 3.3.2

- `ftl2js`: keep the arguments of a term reference, `{ -brand(case: "accusative") }` was turned into `{ -brand }`
- `ftl2js`: a function call with a literal argument, like `{ NUMBER(42) }`, no longer throws

### 3.3.1

- `ftl2js`: a message with attributes but no value no longer throws
- `js2ftl`: an object without `val` writes `key =` instead of `key = undefined`
- `ftl2js`: keep the attribute of a message reference, `{ login-input.placeholder }` was turned into `{ login-input }`
- `ftl2js`: keep number literals in named arguments unquoted, `minimumFractionDigits: 2` was turned into `minimumFractionDigits: "2"`

### 3.3.0

- Support function calls as selectors #5

### 3.2.0

- support MessageReference

### 3.1.0

- handle Group and Resource comments
- add optional `respectComments` parameter to `ftl2js`

### 3.0.1

- transpile also esm

### 3.0.0

- update fluent-syntax dep

### 2.0.2

- fix export for node v14 cjs

### 2.0.1

- fix export for dynamic imports

### 2.0.0

- complete refactoring to make this module universal
- MIGRATION:
    - `require('fluent_conv/ftl2js')` should be replaced with `require('fluent_conv/cjs/ftl2js')`
    - `require('fluent_conv/js2ftl')` should be replaced with `require('fluent_conv/cjs/js2ftl')`

### 1.1.1

- getVariant name fix for NumberLiteral variants [2](https://github.com/locize/fluent_conv/pull/2)

### 1.1.0

- add support for functions
