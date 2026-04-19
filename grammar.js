/**
 * @file Rich Presence for RetroAchievement
 * @author Fraise
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-nocheck

export default grammar({
  name: "rapresence",

  extras: $ => [
    /\s/
  ],

  rules: {
    source_file: $ => seq(
      repeat($._bloc),
    ),

    _bloc: $ => choice(
      $.format,
      $.lookup,
      $.display,
      $._line,
    ),

    _line: $ => seq(
      optional($.comment),
      '\n'
    ),


    format: $ => seq(
      $.format_definition,
      optional($.format_type_definition),
    ),

    format_definition: $ => seq(
      'Format', ':',
      $.identifier,
      optional($.comment),
      '\n'
    ),

    format_type_definition: $ => seq(
      'FormatType', '=',
      $.format_type,
      optional($.comment),
      '\n'
    ),

    format_type: $ => choice(
      'SCORE',
      'FRAMES',
      'MILLISECS',
      'SECS',
      'MINUTES',
      'SECS_AS_MINS',
      'VALUE',
      'UNSIGNED',
      'TENS',
      'HUNDREDS',
      'THOUSANDS',
      'FIXED1',
      'FIXED2',
      'FIXED3',
      'FLOAT1',
      'FLOAT2',
      'FLOAT3',
      'FLOAT4',
      'FLOAT5',
      'FLOAT6'
    ),

    lookup: $ => seq(
      $.lookup_definition,
      repeat($.lookup_statement),
    ),

    lookup_definition: $ => seq(
      'Lookup',':',
      $.identifier,
      optional($.comment),
      '\n'
    ),

    lookup_statement: $ => seq(
      $.key,
      '=',
      optional($.value),
      optional($.comment),
      '\n'
    ),

    key: $ => seq(
      $.key_item,
      repeat(seq(',',$.key_item)),
    ),

    key_item: $ => choice(
      $.range,
      $.number
    ),

    range: $ => seq(
      $.number, '-', $.number
    ),

    number: $ => choice(
      '*',
      /0x[0-9a-fA-F]+/,
      /[0-9]+/
    ),

    value: $ => prec(1, /[^\n]+/),

    display: $ => prec(1, seq(
      $.display_header,
      repeat($.conditional_display),
      optional($.default_display),
    )),

    display_header: $ => seq('Display', ':', optional($.comment), '\n'),

    conditional_display: $ => seq(
      $.condition,
      $.display_statement,
    ),

    default_display: $ => seq(
      $.display_statement,
    ),

    display_statement: $ => seq(
      repeat1(choice($.macro, $.text)),
      optional($.comment),
      '\n'
    ),

    condition: $ => seq(
      '?',
      $.logic,
      '?'
    ),

    macro: $ => seq(
      '@',
      $.identifier,
      '(',
      $.logic,
      ')'
    ),

    logic: $ => /[^?)]*/,
    text: $ => /[^\n@?][^\n@]*/,
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    comment: $ => prec(-1, token(seq('//', /[^\n]*/))),
  }
});
