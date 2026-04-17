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
      $.display
    ),

    _bloc: $ => choice(
      $.format,
      $.lookup
    ),

    format: $ => seq(
      'Format', ':',
      $.identifier, '\n',
      'FormatType', '=',
      $.format_type,
      '\n'
    ),

    lookup: $ => seq(
      'Lookup', ':',
      $.identifier, '\n',
      repeat($.lookup_statement),
      '\n'
    ),

    lookup_statement: $ => seq(
      $.key,
      /\s/, '=',
      $.value,
      '\n'
    ),

    key: $ => choice(
      /0x[0_9a-fA-F]+/,
      /[0-9]+/
    ),

    value: $ => /[^\n]+/,

    display: $ => seq(
      'Display:',
      repeat($.conditional_display),
      optional($.default_display),
      '\n'
    ),

    conditional_display: $ => seq(
      $.condition,
      repeat(choice($.macro, /./)),
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

    logic: $ => /[^?\n)].+/,
    default_display: $ => /[^\n]*/,
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    comment: $ => token(seq('//', /[^\n]*/)),
  }
});
