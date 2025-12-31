# Core Syntax

A **Plumark** document (`.plu` or `.pmark`) can be composed with four essential kinds of construct:

- [_frontmatter_](#frontmatter)
- [_markup_](#markup)
- [_statement_](#statement)
- [_escape sequence_](#escape-sequence)

## Frontmatter

The **frontmatter** block comprises content that is not interpreted by the parser, but can be used by renderers for tooling purposes — e.g., CSS stylesheet, YAML/TOML configuration.

If present, it must appear at the beginning of the document within a dashed fence:

```text
---
frontmatter (opaque)
---
```

## Markup

Any text that is not recognized as frontmatter, statement, or escape sequence is considered **markup**. Markup is divided into **elements**, which can be classified both in terms of how they are _framed_ (or _marked out_) in the source document and how they are _presented_ (or _laid out_) in the rendered output.

In the source, elements follow a coherent, precise, and flexible syntax. They can have **content**, which may contain arbitrarily nested markup; and their behavior can be configured through markup **attributes**, organized as an associative array.

This section describes the various types of markup elements, how they can be instantiated, their rendering implications, and related concepts.

### Markup mode

Markup elements can be instantiated in different formats, depending on their arrangement in the source document. Each of these formats is called **mode** and implies a presentation **layout**:

| Mode        | Layout | Delimited | Notes                                                           |
| ----------- | ------ | --------- | --------------------------------------------------------------- |
| _line_      | block  | ❌        | line begins with a [sigil](#markup-sigil) and ends with content |
| _inline_    | inline | ☑️        | single-line; possibly surrounded by text                        |
| _multiline_ | block  | ☑️        | must be flushed out; can span multiple lines                    |

When an element appears both flushed out _and_ delimited on a single line, its layout will depend on its type: if it supports inline mode, the layout will be inline; otherwise, it will be block.

Furthermore, depending on configuration, some elements may be rendered in _floating_ layout (e.g., floating image or marginal note).

### Markup element

An **element** in the source document is a piece of information that has meaning. The most basic type of element is the _paragraph_. Paragraphs are delimited by sequences of blank lines or by the end-of-file.

Any text interspersed with elements in a paragraph is considered _inline_, _free-form_ or _flowing_ text (not to be confused with _floating_). Sequences of spaces are collapsed by default, unless escaped.

The more interesting elements are summarized below — all of them support _multiline_ mode:

| Syntax                  | HTML/CSS                     | Meaning              | Line | Inline |
| ----------------------- | ---------------------------- | -------------------- | ---- | ------ |
| `@[link]`               | `a`                          | hyperlink            | ☑️   | ☑️     |
| `![media]`              | `img`, `audio`, `video`      | embedded media       | ☑️   | ☑️     |
| `?[span]`               | `span`                       | anchor, focus, style | ☑️   | ☑️     |
| `*[bold]`               | `b`                          | bold face            | ☑️   | ☑️     |
| `/[italic]`             | `i`                          | italic face          | ☑️   | ☑️     |
| `~[struck]`             | `s`                          | struck-out text      | ☑️   | ☑️     |
| `+[highlighted]`        | `mark`                       | highlighted text     | ☑️   | ☑️     |
| `_[subscript]`          | `sub`                        | subscript font       | ☑️   | ☑️     |
| `^[superscript]`        | `sup`                        | superscript font     | ☑️   | ☑️     |
| `**[strong]`            | `strong`                     | emphasized text      | ☑️   | ☑️     |
| `//[emphasis]`          | `em`                         | emphasized text      | ☑️   | ☑️     |
| `~~[deleted]`           | `del`                        | deleted text         | ☑️   | ☑️     |
| `++[inserted]`          | `ins`                        | inserted text        | ☑️   | ☑️     |
| `__[unarticulated]`     | `u`                          | text decoration      | ☑️   | ☑️     |
| `^^[cited]`             | `cite`                       | citation             | ☑️   | ☑️     |
| `` lang`snippet` ``     | `pre`, `code`, `samp`, `kbd` | monospaced, snippet  | ❌   | ☑️     |
| `` $`math` ``           | MathJax/KaTeX                | math expression      | ❌   | ☑️     |
| `` &`verbatim` ``       | raw HTML                     | pass-through         | ❌   | ☑️     |
| `#[heading]`            | `h[1-6]`                     | heading              | ☑️   | ❌     |
| `"[quote]`              | `blockquote`                 | blockquote           | ☑️   | ❌     |
| `'[aside]`              | `aside`                      | sidenote, callout    | ☑️   | ❌     |
| `.[note]`               | `p`, `footer`                | footnote, tooltip    | ☑️   | ❌     |
| `:[topic]`              | `dl`, `dt`                   | glossary term        | ☑️   | ❌     |
| `=[description]`        | `dl`, `dd`                   | glossary definition  | ☑️   | ❌     |
| `-[list item]`          | `ul`, `li`                   | unordered list       | ☑️   | ❌     |
| `ord.[list item]`       | `ol`, `li`                   | ordered list         | ☑️   | ❌     |
| `[check][box]`          | `input`, `label`             | checklist            | ☑️   | ❌     |
| `{name}[component]`     | `script`, generated          | semantic block       | ☑️   | ☑️     |
| `[ table cell \| ... ]` | `table` `tr`, `th`, `td`     | table row            | ❌   | ❌     |
| `<[left-aligned]`       | `p`, `text-align`            | text alignment       | ☑️   | ❌     |
| `>[right-aligned]`      | `p`, `text-align`            | text alignment       | ☑️   | ❌     |
| `><[centered]`          | `p`, `text-align`            | text alignment       | ☑️   | ❌     |
| `<>[justified]`         | `p`, `text-align`            | text alignment       | ☑️   | ❌     |

### Markup syntax

Except for paragraphs, all markup elements follow this general syntax:

```text
<sigil><prefig><content><config>
```

Its constituents are:

| Part      | Delimiter           | Notes                                      |
| --------- | ------------------- | ------------------------------------------ |
| _sigil_   | space, line break   | introducer symbol (or sequence of symbols) |
| _prefig_  | parentheses         | attribute block preceding the content      |
| _content_ | brackets, backticks | rich/literal text block                    |
| _config_  | parentheses         | attribute block succeeding the content     |

Special cases:

- table rows have neither sigil nor prefiguration, since they are by themselves a rich text block
- snippet, math and verbatim elements support only literal content

### Markup sigil

The **sigil** introduces a markup element. It generally consists of one or two punctuation marks, but there are some notable exceptions:

| Element             | Notes                                               | Example             |
| ------------------- | --------------------------------------------------- | ------------------- |
| _ordered list item_ | variable-length word, ending with a dot             | `11.`, `xi.`, `aa.` |
| _checkbox_          | one character enclosed in square brackets           | `[ ]`, `[x]`, `[✓]` |
| _table row_         | at least two characters enclosed in square brackets | `[a ]`, `[ a]`      |
| _component_         | identifier enclosed in curly braces (without space) | `{name}`            |
| _snippet_           | language identifier (when followed by a backtick)   | `lang`              |

Throughout this document, whenever an _identifier_ is expected, it must abide to the regex `/[\w-]+/`.

### Attribute block

An attribute block comprises markup **metadata**. In its expanded form, it is a parenthesized dictionary with flat structure:

```text
(key = 'single-quoted string'
key2 = "double-quoted string"
key3 = `literal multiline
string`)
```

Attribute blocks are subject to the following rules:

- Keys are identifiers; values are opaque text.
- Interspace is ignored. (including line breaks)
- Prefiguration and configuration are merged in that order.
- Repeated assignments simply overwrite the attribute value.

#### Attribute order

For convenience, an alternative syntax is permitted in which attribute values are specified without their respective keys, but in a specific _order_. Each element type defines the order of its attributes, from most to least important.

Below are listed examples of elements with their most important attribute specified using this syntax, in various ways:

|                Prefiguration | Configuration              | Line mode                |
| ---------------------------: | -------------------------- | ------------------------ |
|          `@('target')[link]` | `@[link]('target')`        | `@('target') link`       |
|         `!('source')[media]` | `![media]('source')`       | `!('source') media`      |
|           `?('label')[span]` | `?[span]('label')`         | `?('label') span`        |
|    `+('color')[highlighted]` | `+[highlighted]('color')`  | `+('color') highlighted` |
| `` lang('label')`snippet` `` | ``lang`snippet`('label')`` |                          |
|       `` $('label')`math` `` | ``$`math`('label')``       |                          |
|        `#('label')[heading]` | `#[heading]('label')`      | `#('label') heading`     |
|         `"('source')[quote]` | `"[quote]('source')`       | `"('source') quote`      |
|           `'('type')[aside]` | `'[aside]('type')`         | `'('type') aside`        |
|           `.('label')[note]` | `.[note]('label')`         | `.('label') note`        |
|                              | `[ cell \| ... ]('label')` |                          |

### Rich text block

A text block enclosed in square brackets comprises **rich** content:

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

In _line_ mode, brackets are omitted and the content spans the entire line:

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

### Literal text block

A text block enclosed in backticks comprises **literal** content:

```text
*`bold text with *[mock <markup>]`
cpp`void func()`
ts``
const str = `my string`;
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

The number of backticks in the closing delimiter must match that of the opening delimiter, e.g.:

````text
plu```
snippet with inner
plu``
snippet with inline `snippet`
``
```
````

Although opaque to the parser, literal content is handled specially by the renderer according to element type:

| Element    | Rendered as                                                   |
| ---------- | ------------------------------------------------------------- |
| _snippet_  | sanitized; spaces preserved; monospaced; syntax-highlighted   |
| _math_     | generated markup or script; backend-specific (KaTeX, MathJax) |
| _verbatim_ | raw markup code; backend-specific (HTML, LaTeX)               |
| all others | sanitized; spaces collapsed                                   |

### Lists

There are four kinds of natively-supported **lists**:

| List type   | Nestable |
| ----------- | -------- |
| _glossary_  | ❌       |
| _unordered_ | ☑️       |
| _ordered_   | ☑️       |
| _checklist_ | ☑️       |

The available item types for each kind of list are:

| Sigil | Used for        | List type |
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

The first item in an ordered list is called the _leader_: it establishes the numbering scheme, so that list items can be rendered uniformly — and the formatter can normalize item sigils based on it.

#### List nesting

The dash symbol (`-`) serves an additional purpose — it can be used as level indicator for nestable items:

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

The same behavior can be accomplished through the more general, _multiline_ mode:

```text
A.[
  multiline item
  I.[
    multiline subitem
    [ ] unchecked sub-subitem
  ]
]
```

Indentation is ignored, although the formatter can normalize it based on the nesting level (whether encoded in the sigil or deduced from bracket pairing).

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

The pipe symbol (`|`) delimits cells within a row. Each row may have a different number of cells, which are assigned to columns from left to right, in the order they appear in the source document. The number of columns in a table is determined by the row with the most cells.

#### Header cell

If a table cell begins with a hashtag (`#`), it is considered the **header** of a group of cells:

```text
[ # header | # header | # header ]
[ # header | 1        | 2        ]
[ # header | 3        | 4        ]
```

The exact meaning of a header cell depends on the renderer. Typically, a header in the top row is regarded as column header; similarly, a header in the leftmost column is regarded as row header. Column headers take precedence over row headers.

#### Divisor row

A row composed exclusively of dashes (`-`) is called a **divisor** row: it is rendered as a solid line in place of the affected row. Tables can have multiple divisor rows (or none), and the row may itself consist of a single cell:

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
[ 1 & 2       |    3 ](align = 'l-|r')
[    1 | 2 & 3       ](align = 'r|j-')
[     1 & 2 & 3      ](align = 'c--')
```

Here's a (non-exhaustive) list of attributes that deserve support by renderers:

| Name    | HTML/CSS                | Level | Notes                       |
| ------- | ----------------------- | ----- | --------------------------- |
| _label_ | `id`                    | table | label for cross-referencing |
| _class_ | `class`                 | table | preset table style          |
| _color_ | `style`                 | row   | emphasis color              |
| _line_  | `border`                | row   | border line type            |
| _align_ | `text-align`, `colspan` | both  | column alignment & spanning |

Note how the `align` attribute serves two important functions:

- text alignment per column (which may persist across rows)
- merging of adjacent cells

This design is intentional, to avoid syntax overload inside table rows. The formatter is free to align content within rows according to the specified alignment/spanning setting.

### Components

The primary way to extend rendering capabilities is through **components**. These elements can provide non-textual cues, interactive behavior, or code-driven visualization — maps, plots, graphs, charts, diagrams, etc.

Here's a (non-exhaustive) list of components that deserve support by renderers:

| Name                 | HTML                          | Notes                | Inline |
| -------------------- | ----------------------------- | -------------------- | ------ |
| _spoiler_, _summary_ | `details`, `summary`          | disclosure element   | ❌     |
| _menu_, _option_     | `select`, `option`            | dropdown menu        | ☑️     |
| _form_, _field_      | `form`, `input`               | form; answer sheet   | ❌     |
| _nav_, _entry_       | `nav`, `ul`, `li`, `a`        | navigation bar; TOC  | ❌     |
| _deck_, _card_       | `div`, `script`               | showcase deck/grid   | ❌     |
| _panel_, _tile_      | `div`, `script`               | flip-through gallery | ❌     |
| _stack_, _tab_       | `div`, `script`               | tabbed navigation    | ❌     |
| _flow_, _step_       | `div`, `script`               | multi-step recipe    | ❌     |
| _folder_, _file_     | `div`, `script`               | filesystem hierarchy | ❌     |
| _tag_                | `div`, `p`                    | badge; status; stamp | ☑️     |
| _link_               | `button`, `a`                 | actionable link      | ☑️     |
| _radio_              | `input`, `label`              | radio button         | ❌     |
| _group_              | `div`, `optgroup`, `fieldset` | child grouping       | ❌     |
| _filter_             | `div`, `search`, `input`      | child filtering      | ❌     |
| _progress_           | `progress`                    | completion indicator | ☑️     |

If a component can be subject to [cross-referencing](#references), it should offer the appropriate attributes.

## Statement

Statements are handled by the language **processor**, typically before parsing. They appear within angled brackets:

| Syntax        | Inline | Meaning     | Notes                                    |
| ------------- | ------ | ----------- | ---------------------------------------- |
| `<!flag ...>` | ❌     | _pragma_    | declaration; rendering configuration     |
| `<?verb ...>` | ❌     | _directive_ | flow control; content selection          |
| `<@name ...>` | ❌     | _macro_     | textual template; variable assignment    |
| `<$name>`     | ☑️     | _expansion_ | macro replacement; content interpolation |
| `<&label>`    | ☑️     | _reference_ | cross-referencing; two-pass resolution   |
| `<% text %>`  | ☑️     | _comment_   | non-semantic block; opaque               |

Note that any text not starting with `<` + sigil has no intrinsic meaning in prose and is treated as literal text. Non-supported sigils (ASCII punctuation) are reserved for future use.

This section discusses the various types of statement, how they can affect the rendering pipeline, and related concepts.

### Pragmas

The **pragma** statement exists solely to configure the processor itself. It introduces or modifies an abstract, unobservable entity that may change interpretation and/or presentation rules.

The general syntax for pragmas is `<!flag [:type] attrs...>`, where `flag` denotes the named entity, `:type` is an optional type ascription, and its body is the same as that of an expanded [attribute block](#attribute-block).

Currently, this type of statement has a single use-case: declaring cross-reference scopes (a.k.a. series).

#### Series

Every element that is subject to cross-referencing is called a _referable_ object, and it must belong to a **series**. Series can be configured through a set of attributes:

| Attribute   | Meaning                                             |
| ----------- | --------------------------------------------------- |
| `sequence`  | the numbering scheme (Arabic, Latin, Roman, Symbol) |
| `caption`   | template for the element's caption                  |
| `placement` | relative placement of the caption                   |
| `ref`       | template for the inline reference                   |
| `backref`   | template for the back-reference                     |

In templated attributes, the following parameters are allowed:

| Parameter | Meaning            | Example         |
| --------- | ------------------ | --------------- |
| `%d`      | element designator | `1`,`A`,`I`,`*` |
| `%s`      | element title      | `My figure`     |
| `%l`      | element label      | `my-fig`        |
| `%r`      | return location    | generated       |

Here's a list of predefined series (which can be modified if needed):

| Series     | Default for | Sequence | Caption           | Placement | Ref                | Backref      |
| ---------- | ----------- | -------- | ----------------- | --------- | ------------------ | ------------ |
| `figure`   | _media_     | Arabic   | `Figure %d — %s`  | below     | `Fig. @[%d]('%l')` |              |
| `table`    | _table_     | Arabic   | `Table %d — %s`   | above     | `Tab. @[%d]('%l')` |              |
| `section`  | _heading_   | Arabic   | `%d.`             | inline    | `Sec. @[%d]('%l')` |              |
| `footnote` | _note_      | Arabic   | `^[%d]`           | inline    | `@[^[%d]]('%l')`   | `@[↩]('%r')` |
| `example`  | _snippet_   | Arabic   | `Example %d — %s` | above     | `Ex. @[%d]('%l')`  |              |
| `equation` | _math_      | Arabic   | `(%d)`            | right     | `Eq. @[%d]('%l')`  |              |

Here's an example of overriding the footnote series declaration to include brackets:

```text
<!footnote caption="^`[%d]`" ref="@[^`[%d]`]('%l')" >
```

### Directives

The **directive** statement is similar to a flow control statement in programming languages. It directs the flow of document content, using document metadata as state and evaluating expressions composed through a micro-DSL.

The general syntax for directives is `<!verb expr...>`, where `verb` denotes the instruction to be carried out, and its body is an expression containing _clauses_ that modify its evaluation. Below are listed the available verbs and their respective clauses:

| Verb        | Meaning        | Clauses                  |
| ----------- | -------------- | ------------------------ |
| `with`      | _transclusion_ | `from`, `as`             |
| `if`/`else` | _selection_    | `is`, `not`, `and`, `or` |
| `for`       | _iteration_    | `of`                     |
| `end`       | _closure_      |                          |

Directives with unknown verbs are ignored.

#### Transclusion

The **transclusion** directive is akin to its programming counterpart: it brings content and/or macros from an external source into the current document.

Its most basic syntax is `<?with path>`, where `path` is a string indicating the path to a local file (e.g., `'path/to/intro.plu'`). This form works like _file inclusion_: it resolves the referenced file and expands its entire content at the invocation point, making it part of the document.

An alternative syntax is `<?with path as scope>`, where `scope` is an identifier. This form works like _scoped expansion_: it does the same thing as before, but introduces a named scope for the macros contained within the referenced document, which can then be referred to via qualification: `<$scope.macro>`.

In both forms, macros from the current scope are visible in the child scope, but homonymous macros are [_shadowed_]. Global registries — such as counters used for cross-referencing — and parser configuration have shared scope, so their updates persist.

Documents transcluded in this way are primarily intended as _structural fragments_ rather than reusable templates. Nevertheless, multiple expansion of the same document is permitted, provided that cross-referencing labels use [expansion](#expansions) to ensure uniqueness.

A more selective form of transclusion can be achieved through the syntax `<?with names... from path>`, where `names` is a comma-separated list of macro identifiers. This form works like _named import_: it resolves the referenced document and makes the referred macro(s) visible in the current scope. Imported macros can also be _aliased_: `<?with name as alias,... from path>`.

#### Selection

The **selection** directive is akin to its programming counterpart: it selects a _branch_ of content based on a _condition_ expression.

Its most basic syntax is `<?if name rel value>`, where `name` is a macro identifier, `rel` is either `is`, `not` or absent, and `value` is either a string or a function call. In the latter case, the call must be made to one of the built-in functions:

| Function        | Meaning          |
| --------------- | ---------------- |
| `eq(value)`     | equal to         |
| `gt(value)`     | greater than     |
| `lt(value)`     | less than        |
| `ge(value)`     | greater or equal |
| `le(value)`     | less or equal    |
| `in(values...)` | one of           |
| `defined()`     | defined macro    |

Multiple conditions can appear in the same expression, connected by one of the conjunctions: `<?if cond1 or cond2 and cond3...>`. Conditions are associated from left to right, such that the leftmost conjunction is evaluated first, then the second from the left, and so on. To override this behavior, conditions can be grouped in parentheses, e.g.: `cond1 or (cond2 and cond3)`.

In a selection directive, the `else` verb can be used to end the previous branch and begin a new one: `<?else expr>`, where `expr` is an optional condition expression, to further drive the selection. The absence of this condition means that the new branch is the last one, and the directive must be properly [closed](#closure).

The effect of such a directive depends on the evaluated expression:

- if it turns out to be _true_, the range of content beginning at the next line, going up to the corresponding `else` or `end`, is selected;
- otherwise, if an `else` exists:
  - with a condition, it is evaluated like an `if`;
  - without condition, the range of content beginning at the line following it, going up to the corresponding `end`, is selected;
- otherwise, no content is selected.

#### Iteration

The **iteration** directive is akin to its programming counterpart: it repeats a region of content based on a _loop variable_.

Its most basic syntax is `<?for name of values...>`, where `name` is a newly-introduced macro identifier, and `values` is a comma-separated list of strings. The variable assumes each of the specified values in turn, but is only available within the scope of the directive.

The effect of such a directive is: for each of the values assumed by the loop variable, the range of content beginning at the next line, going up to the corresponding `end`, is repeated. The variable can then be expanded within that region.

#### Closure

The **closure** directive ends the scope of the previous selection or iteration directive, if any. Stray closure directives are ignored. Its syntax is `<?end>` (bodiless).

### Macros

The **macro** statement defines a named variable or function-like macro (i.e., with input parameters) having a textual value. It works similarly to macros in programming languages.

Its most basic syntax is `<@name value>`, where `name` is the macro identifier, and `value` is a string. The macro is defined as having the specified value, which can thereafter be [expanded](#expansions).

An alternative, more powerful syntax is `<@name(params...) value>`, where `params` is a comma-separated list of identifiers. In this case, the value can make use of parameters as though they were macros themselves, i.e., they can be expanded.

Note that macro parameter names should be chosen carefully, as they may [_shadow_] macros from the document scope.

### Expansions

The **expansion** statement is equivalent to text _substitution_ used in templating engines. The processor looks up the value associated with the referred variable/macro and places it at the invocation point.

Its most basic syntax is `<$name>`, where `name` is a macro identifier. Sometimes, macro names are scoped, in which case they must be _qualified_: `<$scope.name>`.

When the referred macro has input parameters, the syntax changes slightly: `<$name(...)>`, where `(...)` has the same body of an [attribute block](#attribute-block). In this case, the order of the parameters (as defined in the macro) establishes the attribute order.

Expansions can be used to interpolate cryptic text, such as long URLs, even within markup attributes. However, it does not work inside [literal](#literal-text-block) content.

### References

The **reference** statement is a cross-reference to an enumerated element. The processor looks up the designator assigned to the referred element and places a reference to it at the invocation point.

An element can be configured to be referable through a set of related attributes:

| Attribute | Meaning                               |
| --------- | ------------------------------------- |
| `label`   | unique identifier (required for xref) |
| `title`   | element description                   |
| `series`  | owning [series](#series)              |

A referable element is enumerated by assigning it the next designator from its series' sequence, and sequences only advance when elements are _rendered_.

Because footnotes are rendered only when referenced, their sequence advances at each encountered reference; for all other series, the sequence advances at each labeled element.

### Comments

The **comment** statement is equivalent to a comment in programming languages: it serves to _annotate_ the source code.

Its syntax is `<% ... %>`, where the body is treated as opaque text. Note that the closing delimiter cannot be escaped, e.g.:

```text
<% comment \%> prose %>
```

produces

> prose %>

Comments may be either discarded or emitted in the generated output, depending on implementation. But the statement should be treated as a normal AST node by the parser.

## Escape sequence

An **escape sequence** is a sequence of ASCII characters that produces text or markup, which cannot otherwise be typed, or could compromise readability if typed explicitly. They can be used anywhere markup is allowed.

The available sequences are listed below:

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

They are typically handled by the processor or parser, almost never reaching the renderer. This section explains the various types of escape sequences.

### Break-control

The **break** markers express author intent about where text may or may not wrap:

- line breaks _produce_ hard breaks;
- blank lines _delimit_ paragraphs;
- soft markers _suggest_ a breaking opportunity;
- no-break markers _protect_ continuity.

Available parameters for break escapes:

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

When a backslash (`\`) is followed directly by one of the ASCII punctuation symbols, the latter is produced **literally**, as if enclosed in a [literal block](#literal-text-block).

<!-- list of URLs -->

[_shadow_]: https://en.wikipedia.org/wiki/Variable_shadowing
[_shadowed_]: https://en.wikipedia.org/wiki/Variable_shadowing
[_shortcode_]: https://api.github.com/emojis
[_codepoint_]: https://developer.mozilla.org/en-US/docs/Glossary/Code_point
