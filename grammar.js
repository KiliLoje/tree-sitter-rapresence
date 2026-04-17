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
    /\s/,
    $.comment
  ],

  rules: {
    source_file: $ => seq(
      repeat($._bloc),
    ),

    _bloc: $ => choice(
      $.format,
      $.lookup,
      $.display
    ),

    format: $ => seq(
      $.format_definition,
      optional($.format_type_definition),
    ),

    format_definition: $ => seq(
      'Format', ':',
      $.identifier,
    ),

    format_type_definition: $ => seq(
      'FormatType', '=',
      $.format_type
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
    ),

    lookup_statement: $ => seq(
      $.key,
      '=',
      $.value,
    ),

    key: $ => $.key_expr,

    key_expr: $ => seq(
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

    value: $ => /[^\n]+/,

    display: $ => seq(
      $.display_header,
      repeat($.conditional_display),
      optional($.default_display),
    ),

    display_header: $ => seq('Display', ':', '\n'),

    conditional_display: $ => seq(
      $.condition,
      repeat(choice($.macro, $.text)),
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

    logic: $ => /[^?)]+/,
    text: $ => /[^\n@]+/,
    default_display: $ => /[^?\n][^\n]+/,
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    comment: $ => token(seq('//', /[^\n]*/)),
  }
});
