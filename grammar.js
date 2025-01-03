/**
 * @file parser for paper—ppr—projects
 * @author Adamina Barx <adaminabarx@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "ppr",

  rules: {
    document: $ => repeat(choice(
      $.function,
      $.title,
      $.heading,
      $.bookmark,
      $.paragraph,
    )),

    title: $ => seq('\\', 'T', $.sentence), 
    heading: $ => seq('\\', choice($.h1, $.h2, $.h3, $.h4, $.h5, $.h6), $.sentence),
    bookmark: $ => seq('\\', 'B', $.sentence),
    paragraph: $ => seq('\\', 'P', seq(repeat($.sentence), repeat($.fragment))),

    identifier: $ => seq(/[a-z]/, /[a-zA-Z\d]*/),
    parameter: $ => seq(/[a-z]/, /[a-zA-Z\d]*/),
    value: $ => seq('"', /[^"]+/, '"'),
    function: $ => seq('\\', $.identifier, '(', repeat(seq($.parameter, ':', $.value, ',')), optional(seq($.parameter, ':', $.value)), ')'),

    word: $ => /[a-zA-Z'’\d]+/,
    hyphen: $ => seq($.word, repeat1(seq('-', $.word))),

    style_marker: $ => choice(
      $.bold,
      $.italics,
      $.underline,
      $.reference,
    ),

    fragment: $ => prec.right(seq($._fragment, repeat($.punctuation))),

    sentence: $ => prec.right(choice(
      $.core,
      $.layer,
    )),

    core: $ => prec(1, seq($._fragment, $.end)),
    layer: $ => prec(2, choice(
      seq($._fragment, $.punctuation, $.core),
      seq($._fragment, $.punctuation, $.layer),
    )),
    
    _fragment: $ => repeat1(choice(
      $.hyphen,
      $.word,
      $.style_marker,
      $.other,
      $.wtf,
    )),

    // capture any junk characters that would cause tree sitter to error
    wtf: $ => /[^a-zA-Z'’\d\s\-\"@\$\%\^&\*\_\+=~`.,;:\/?!\\]+/,

    
    end: $ => choice(
      $.period,
      $.question_mark,
      $.exclamation_point,
    ),

    punctuation: $ => choice(
      $._surround,
      $.comma,
      $.semicolon,
      $.colon,
      $.fslash,
      $.emdash
    ),

    _surround: $ => choice(
      $.quote,
      $.parentheses,
    ),

    _surround_content: $ => choice(
      seq(repeat1($.sentence), repeat($.fragment)),
      seq(repeat($.sentence), repeat1($.fragment)),
    ),

    quote: $ => prec.left(choice(
      seq("\"", $._surround_content, "\""),
      seq( "“", $._surround_content, "”"),
    )),

    parentheses: $ => prec.left(seq("(", $._surround_content, ")")),

    other: $ => choice('@', '$', '%', '^', '&', '*', '&', '_', '+', '=', '~', '`'),

    h1: $ => 'H1',

    h2: $ => 'H2',

    h3: $ => 'H3',

    h4: $ => 'H4',

    h5: $ => 'H5',

    h6: $ => 'H6',

    period: $ => '.',

    comma: $ => ',',

    semicolon: $ => ';',

    colon: $ => ':',

    fslash: $ => '/',

    question_mark: $ => '?',

    exclamation_point: $ => '!',

    bold: $ => '**',

    italics: $ => '//',

    emdash: $ => '--',

    underline: $ => '__',

    reference: $ => '&&',

  }
});
