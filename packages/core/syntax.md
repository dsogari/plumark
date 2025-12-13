# Core Syntax

A **Plumark** document (`.plu` or `.pmark`) can be composed with four essential constructs:

- _frontmatter_
- _markup_
- _preprocessing_
- _escape sequence_

They are described below.

## Frontmatter

The **frontmatter** block, if present, must appear at the beginning of the document within a dashed fence:

```text
---
frontmatter (opaque)
---
```

Its content is _opaque_ (i.e., uninterpreted by the parser), and can be used by renderers as metadata — e.g., CSS stylesheet, YAML/TOML configuration.

## Markup

Any text that is not recognized as either frontmatter, preprocessing or escape sequence is considered **markup**. Markup is divided into _elements_, which can be classified both in terms of how they are _framed_ in the source document, and how they are _presented_ in the rendered output.

In source, elements follow a **coherent, precise and flexible syntax**. They may have _content_, which may contain inner, arbitrarily nested markup; and their behavior can be configured through markup _attributes_, which follow a flat structure.

This section describes the various types of markup elements, how they can be instantiated, their rendering implications, and related concepts.

### Markup element

An **element** in the source document is a piece of information that has meaning. The most basic type of element is the _paragraph_. Paragraphs are delimited by sequences of blank lines or the end of file. Any text interleaving elements in a paragraph is considered part of the paragraph, flowing along with other elements.

The more interesting elements are summarized below:

| Syntax                  | HTML/CSS                     | Meaning              | Key attribute | Inline |
| ----------------------- | ---------------------------- | -------------------- | ------------- | ------ |
| `@[link]`               | `a`                          | hyperlink            | target        | ☑️     |
| `![media]`              | `img`, `audio`, `video`      | embedded media       | source        | ☑️     |
| `?[span]`               | `span`                       | anchor, focus, style | label         | ☑️     |
| `*[bold]`               | `b`                          | bold face            |               | ☑️     |
| `/[italic]`             | `i`                          | italic face          |               | ☑️     |
| `~[struck]`             | `s`                          | struck-out text      |               | ☑️     |
| `+[highlighted]`        | `mark`                       | highlighted text     | color         | ☑️     |
| `_[subscript]`          | `sub`                        | subscript font       |               | ☑️     |
| `^[superscript]`        | `sup`                        | superscript font     |               | ☑️     |
| `**[strong]`            | `strong`                     | emphasized text      |               | ☑️     |
| `//[emphasis]`          | `em`                         | emphasized text      |               | ☑️     |
| `~~[deleted]`           | `del`                        | deleted text         |               | ☑️     |
| `++[inserted]`          | `ins`                        | inserted text        |               | ☑️     |
| `__[unarticulated]`     | `u`                          | text decoration      |               | ☑️     |
| `^^[cited]`             | `cite`                       | citation             |               | ☑️     |
| `` lang`code` ``        | `pre`, `code`                | monospace, snippet   | label         | ☑️     |
| `` $`math` ``           | MathJax/KaTeX                | math expression      | label         | ☑️     |
| `` &`verbatim` ``       | raw HTML                     | pass-through         |               | ☑️     |
| `#[heading]`            | `h[1-6]`                     | heading              | label         | ❌     |
| `"[quote]`              | `blockquote`                 | blockquote           | source        | ❌     |
| `'[aside]`              | `aside`                      | sidenote, callout    | type          | ❌     |
| `.[note]`               | `p`, `footer`                | footnote, tooltip    | label         | ❌     |
| `:[topic]`              | `dl`, `dt`                   | glossary term        |               | ❌     |
| `=[description]`        | `dl`, `dd`                   | glossary definition  |               | ❌     |
| `-[list item]`          | `ul`, `li`                   | unordered list       |               | ❌     |
| `ord.[list item]`       | `ol`, `li`                   | ordered list         |               | ❌     |
| `[check][box]`          | `input`, `label`, `fieldset` | checklist            |               | ❌     |
| `{name}[component]`     | `script`, generated          | semantic block       |               | ❌     |
| `[ table cell \| ... ]` | `table` `tr`, `th`, `td`     | table row            | label         | ❌     |
| `<[left-aligned]`       | `p`, `text-align`            | text alignment       | max-width     | ❌     |
| `>[right-aligned]`      | `p`, `text-align`            | text alignment       | max-width     | ❌     |
| `><[centered]`          | `p`, `text-align`            | text alignment       | max-width     | ❌     |
| `<>[justified]`         | `p`, `text-align`            | text alignment       | max-width     | ❌     |

### Markup frame

Markup elements can be instantiated in different formats, according to their disposition in the source document. Each such format is called a **frame**, and implies a presentation layout:

| Frame       | Presented as | Notes                                                   |
| ----------- | ------------ | ------------------------------------------------------- |
| _inline_    | inline       | delimited on a single line; possibly surrounded by text |
| _multiline_ | block        | delimited; spans multiple lines; must be flushed out    |
| _unary_     | block        | line begins with markup sigil and ends with content     |

### Markup syntax

Except for paragraphs, all markup elements follow this general syntax:

```text
<sigil><preamble><content><postfix>
```

The markup constituents are:

| Part       | Delimiter           | Notes                                      |
| ---------- | ------------------- | ------------------------------------------ |
| _sigil_    | space, line break   | introducer symbol (or sequence of symbols) |
| _preamble_ | parentheses         | attribute block preceding the content      |
| _content_  | brackets, backticks | rich/plain text block                      |
| _postfix_  | parentheses         | attribute block succeeding the content     |

### Markup sigil

The **sigil** introduces a markup element. It is generally composed of one or more punctuation marks, but there are a few notable exceptions:

| Element             | Notes                                               | Example             |
| ------------------- | --------------------------------------------------- | ------------------- |
| _ordered list item_ | variable-length word, ending with a dot             | `11.`, `xi.`, `aa.` |
| _checkbox_          | one character enclosed in square brackets           | `[ ]`, `[x]`, `[✓]` |
| _table row_         | at least two characters enclosed in square brackets | `[a ]`, `[ a]`      |
| _component_         | identifier enclosed in curly braces (with no space) | `{name}`            |
| _code snippet_      | language identifier (when followed by a backtick)   | `lang`              |

### Attribute block

An attribute block comprises markup **metadata**. It is parenthesized and follows a flat structure:

```text
identifier = 'single-quoted string'
identifier = "double-quoted string"
identifier = `literal multiline
string`
```

The following rules apply:

- Interspace is ignored. (including line breaks)
- Identifiers must satisfy the regex `/\w+/`.
- Escape sequences are allowed in quoted strings.
- Preamble and postfix are merged in that order.
- Repeated assignments simply overwrite the attribute value.

#### Key attribute

For convenience, a simplified syntax is allowed in which a single string value (with no identifier) gets assigned to the most important attribute. The latter is denoted as **key attribute**:

|                  Preamble | Postfix                    | Unary                    |
| ------------------------: | -------------------------- | ------------------------ |
|       `@('target')[link]` | `@[link]('target')`        | `@('target') link`       |
|      `!('source')[media]` | `![media]('source')`       | `!('source') media`      |
|        `?('label')[span]` | `?[span]('label')`         | `?('label') span`        |
| `+('color')[highlighted]` | `+[highlighted]('color')`  | `+('color') highlighted` |
| `` lang('label')`code` `` | ``lang`code`('label')``    |                          |
|    `` $('label')`math` `` | ``$`math`('label')``       | `$('label') math`        |
|     `#('label')[heading]` | `#[heading]('label')`      | `#('label') heading`     |
|      `"('source')[quote]` | `"[quote]('source')`       | `"('source') quote`      |
|        `'('type')[aside]` | `'[aside]('type')`         | `'('type') aside`        |
|        `.('label')[note]` | `.[note]('label')`         | `.('label') note`        |
|                           | `[ cell \| ... ]('label')` |                          |

### Rich text block

A rich text block comprises **markup** content. It can be set within square brackets:

```text
*[inline bold and and /[italic]]
~[
  struck-out paragraph
  +[
    struck-out and highlighted paragraph
  ]
  another struck-out paragraph
]
-[
  multiline list item
]
```

Or, in the absence of brackets:

```text
@('target') link
!('source') media
?('label') span
* bold
/ italic
~ struck
+ highlighted
_ subscript
^ superscript
** strong
// emphasis
~~ deleted
++ inserted
__ unarticulated
^^ cited
# heading
" quote
' aside
. note
: topic
= description
- unordered list item
1. ordered list item
[x] checked box
{name} component
< left-aligned
> right-aligned
>< centered
<> justified
```

### Plain text block

A plain text block comprises **literal** content. It can be set within backticks:

```text
cpp`void func()`
ts``
const abc = `my string`;
``
$`1+2=3`
$`
[({$})]
`
&`no @[markup]('here')`
&`
<time datetime="2018-07-07">July 7</time>
`
```

Or, in the absence of backticks:

```text
$ math
& verbatim
```

The number of backticks in the closing delimiter must mach that of the opening delimiter, e.g.:

````text
plu```
snippet with inner
plu``
snippet with inline `snippet`
``
```
````

Although opaque to the parser, literal content is interpreted by the renderer according to element type:

| Element    | Rendered as                                           |
| ---------- | ----------------------------------------------------- |
| _snippet_  | monospaced code; syntax-highlighted; spaces preserved |
| _math_     | generated markup or script (KaTeX, MathJax)           |
| _verbatim_ | raw markup code (HTML, LaTeX)                         |

### Lists

There are four kinds of natively-supported **lists**:

| List        | Nestable |
| ----------- | -------- |
| _glossary_  | ❌       |
| _unordered_ | ☑️       |
| _ordered_   | ☑️       |
| _checklist_ | ☑️       |

The available item types for each kind of list are:

| Sigil | Used for        | List      |
| ----- | --------------- | --------- |
| `:`   | topic           | glossary  |
| `=`   | description     | glossary  |
| `-`   | item; nesting   | unordered |
| `1.`  | Arabic numeral  | ordered   |
| `a.`  | lowercase-Latin | ordered   |
| `A.`  | uppercase-Latin | ordered   |
| `i.`  | lowercase-Roman | ordered   |
| `I.`  | uppercase-Roman | ordered   |
| `[ ]` | unchecked box   | checklist |
| `[x]` | checked box     | checklist |
| `[✓]` | checked box     | checklist |

The first item in an ordered list is denoted as the _leader_. The leader establishes the numbering scheme, so that:

- list items can be rendered appropriately; and
- the formatter can normalize item sigils based on it.

#### List nesting

The dash symbol (`-`) also serves as level indicator for nestable items:

```text
- item
-- subitem 1
--- sub-subitem
-- subitem 2

1. item
  -a. subitem 1
    --i. sub-subitem
  -b. subitem 2

[ ] item
  -[x] subitem 1
    --[ ] sub-subitem
  -[✓] subitem 2
```

The same behavior can be accomplished through the more general, multiline syntax:

```text
A.[
  multiline item
  I.[
    multiline subitem
    [ ] unchecked sub-subitem
  ]
]
```

The parser ignores indentation, although the formatter can normalize it based on the nesting level (whether encoded in the sigil or deduced from bracket pairing).

### Tables

The general syntax for **tables** is:

```text
[ first cell | second cell | ... ]
[
  multiline
  cell       | multiline
               cell        |
                             ...
]
```

The pipe symbol (`|`) separates cells within a row. Rows may have arbitrary number of cells, regardless of other rows. The number of columns in a table is given by the row with most cells. Cells are assigned to columns from left to right, in order of appearance in the source document.

#### Header cell

If a table cell begins with a hashtag (`#`), it is considered the **header** of a group of cells:

```text
[ # header | # header | # header ]
[ # header | 1        | 2        ]
[ # header | 3        | 4        ]
```

The exact meaning of a header cell is renderer-dependent. Usually, a header in the topmost row is considered a column header; similarly, a header in the leftmost column is considered a row header. Column headers take precedence over row headers.

#### Divisor row

A row composed solely of dashes (`-`) is called a **divisor** row: it is rendered as a solid line in place of the affected row. Tables can have multiple divisor rows (or none at all), and the row itself may consist of a single cell:

```text
[ cell | cell ]
[ ---- | ---- ]
[ 1    | 2    ]
[ ----------- ]
```

The formatter is free to normalize the length of line markers according to table content.

#### Table attributes

Table rows accept table-level and row-level **attributes**:

```text
[ cell | cell | cell ]('my-table')
[ ---- | ---- | ---- ](line = 'dashed')
[ 1    | 2    | 3    ](color = 'red')
[ 1 2         |    3 ](align = 'l-|r')
[    1 | 2 3         ](align = 'r|j-')
[       1 2 3        ](align = 'c--')
```

Here's a (non-exhaustive) list of attributes that deserve support:

| Name    | HTML/CSS                | Level | Notes                       |
| ------- | ----------------------- | ----- | --------------------------- |
| _label_ | `id`                    | table | label for cross-references  |
| _class_ | `class`                 | table | preset table style          |
| _color_ | `style`                 | row   | emphasis color              |
| _line_  | `border`                | row   | border line type            |
| _align_ | `text-align`, `colspan` | both  | column alignment & spanning |

Note how the `align` attribute serves two important functions:

- text alignment per column (which may persist across rows)
- merging of adjacent cells

This design is intentional, to avoid syntax overload within table rows. The formatter is free to align content within cells according to the specified alignment/spanning setting.

### Components

The main way to extend rendering capability is through **components**. These can provide non-textual cues, interactive behavior, or code-driven visualization — maps, plots, graphs, charts, diagrams, etc.

Here's a (non-exhaustive) list of components that deserve support:

| Name                 | HTML                          | Notes                |
| -------------------- | ----------------------------- | -------------------- |
| _spoiler_, _summary_ | `details`, `summary`          | Disclosure element   |
| _menu_, _option_     | `select`, `option`            | Dropdown menu        |
| _form_, _field_      | `form`, `input`               | Form; answer sheet   |
| _nav_, _entry_       | `nav`, `ul`, `li`, `a`        | Navigation bar; TOC  |
| _deck_, _card_       | `div`, `script`               | Showcase deck/grid   |
| _panel_, _tile_      | `div`, `script`               | Flip-through gallery |
| _stack_, _tab_       | `div`, `script`               | Tabbed navigation    |
| _flow_, _step_       | `div`, `script`               | Multi-step recipe    |
| _folder_, _file_     | `div`, `script`               | Filesystem hierarchy |
| _tag_                | `div`, `p`                    | Badge; status; stamp |
| _link_               | `button`, `a`                 | Actionable link      |
| _radio_              | `input`, `label`              | Radio button         |
| _group_              | `div`, `optgroup`, `fieldset` | Child grouping       |
| _filter_             | `div`, `search`, `input`      | Child filtering      |
| _progress_           | `progress`                    | Completion indicator |

If a component provides elements that are subject to [cross-referencing](#cross-referencing), it should register itself in the appropriate namespace to subscribe to auto-numbering.

## Preprocessing

Preprocessing constructs appear within angled brackets:

| Syntax            | Meaning    |
| ----------------- | ---------- |
| `<% comment %>`   | annotation |
| `<? directive ?>` | evaluation |
| `<namespace:id>`  | reference  |
| `<$variable>`     | expansion  |

The preprocessor is responsible for:

- stripping **comments** out;
- storing state in the form of document **metadata**;
- performing a two-pass algorithm to resolve cross-**references**;
- interpolating **variables** using the values stored in metadata.

### Directive instructions

A preprocessor **directive** may contain multiple kinds of instructions, some of which are not currently supported:

| Type                     | Supported |
| ------------------------ | --------- |
| `=` (assignment)         | ☑️        |
| `include`/`import`       | ❌        |
| `if`/`else`/`end`        | ❌        |
| `for`/`in`/`end`         | ❌        |
| `case`/`of`/`else`/`end` | ❌        |

As the language evolves and starts supporting more instructions, it will become much more powerful.

#### Variable assignment

The variable **assignment** instruction works exactly like [attribute](#attribute-block) assignment, except that the value is stored in document metadata. It can be used for various purposes, but especially:

- to set the document `version` and `encoding` (as in XML)
- to interpolate cryptic text, such as long URLs
- as a rudimentary templating technique

### Cross-referencing

A **cross-reference** is a link to an internal, auto-numbered object. Referenced objects are numbered separately per namespace. The natively-supported namespaces are listed below:

| Namespace | Used for    |
| --------- | ----------- |
| `fig`     | figure      |
| `tbl`     | table       |
| `sec`     | section     |
| `fn`      | footnote    |
| `ex`      | code sample |
| `eq`      | equation    |

The following rules apply:

- reference labels can be any valid identifier (`/\w+/`); they are scoped by namespace.
- generated markup may be subject to additional formatting (e.g., superscript for footnotes).
- additional namespaces can be registered by the renderer for its supported [components](#components).

## Escape sequences

An **escape sequence** is a sequence of ASCII characters that produces text or markup, which cannot otherwise be typed, or could compromise readability if typed explicitly. The supported sequences are listed below:

| Syntax     | Used for        | Parameter       |
| ---------- | --------------- | --------------- |
| `\br`      | forced break    |                 |
| `\w{.}`    | weak break      | `b`,`h`,`s`,`l` |
| `\n{.}`    | no-break/join   | `b`,`h`,`s`,`l` |
| `\em{.+}`  | emoji           | identifier      |
| `\N{.+}`   | named char      | identifier      |
| `\u{.+}`   | unicode scalar  | hexadecimal     |
| `\u8{.+}`  | utf-8 sequence  | hexadecimal     |
| `\u16{.+}` | utf-16 sequence | hexadecimal     |
| `\x..`     | extended ASCII  | hexadecimal     |
| `\.`       | punctuation     | symbol          |

Legend:

- `.` — character placeholder
- `+` — variable-length repetition

Escape sequences must be handled by the preprocessor or parser, i.e., they should never reach the renderer.

### Break-control

The **break** markers express author intent about where text may or may not wrap:

- line breaks _produce_ hard breaks;
- blank lines _delimit_ paragraphs;
- soft markers _suggest_ a breaking opportunity;
- no-break markers _protect_ continuity.

Available parameters for break escapes are:

| Letter | Used for                                             |
| ------ | ---------------------------------------------------- |
| `b`    | zero-width                                           |
| `h`    | hyphenation                                          |
| `s`    | spacing; collapsing                                  |
| `l`    | linguistic shaping (ligature, grapheme, typographic) |

For example, this excerpt:

<!-- cSpell:disable -->

```text
The URL https://en.wikipedia.org/\w{b}wiki/\w{b}Main_Page can be broken at each path segment, while the word "hyphen\w{h}ation" can be hyphen\w{h}ated. Conversely, the composite word "non\n{h}verbal" should not be broken, and "non\n{b}verbal" should appear on the same line.
```

<!-- cSpell:enable -->

may produce

<!-- cSpell:disable -->

```text
The URL https://en.wikipedia.org/wiki/
Main_Page can be broken at each path segment,
while the word "hyphenation" can be hyphen-
ated. Conversely, the composite word
"non-verbal" should not be broken, and
"non verbal" should appear on the same line.
```

<!-- cSpell:enable -->

### Emoji escape

The **emoji** escape accepts a [_shortcode_] as parameter and produces a single emoji, e.g.:

```text
This is me \em{grinning}.
```

produces

> This is me 😀.

While renderers may allow the shortcode to be typed as free text within colons (e.g., `:grinning:`), this is not specified by the language.

### Unicode escape

The **unicode** escape accepts a [_codepoint_] as parameter and produces a single character, e.g.:

```text
This is me \u{1F600}.
```

produces the same sentence as before.

### UTF escape

The **UTF-8/16** escapes accept a byte sequence as parameter and produce a character sequence, e.g.:

```text
It's \u8{E2 98 95 F0 9F 92 94 E2 8C 9B}.
```

and

```text
It's \u16{2615 D83D DC94 231B}.
```

both produce

> It's ☕💔⌛.

### Literal escape

When a backslash (`\`) is followed directly by one of the ASCII punctuation symbols, the latter is produced **literally**, as if enclosed in a [verbatim](#plain-text-block) element.

<!-- list of URLs -->

[_shortcode_]: https://api.github.com/emojis
[_codepoint_]: https://developer.mozilla.org/en-US/docs/Glossary/Code_point
