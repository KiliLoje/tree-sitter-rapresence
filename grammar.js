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
      $.format_definition,
      $.lookup_definition,
      $.display_definition,
      $._line,
    ),

    _line: $ => seq(
      optional($.comment),
      '\n'
    ),


    format_definition: $ => seq(
      $.format_definition_header,
      optional($.format_type_definition),
    ),

    format_definition_header: $ => seq(
      'Format', ':',
      field('name', $.identifier),
      optional($.comment),
      '\n'
    ),

    format_type_definition: $ => seq(
      'FormatType', '=',
      field('type', $.format_type),
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

    lookup_definition: $ => seq(
      $.lookup_definition_header,
      repeat($.lookup_statement),
    ),

    lookup_definition_header: $ => seq(
      'Lookup',':',
      field('name', $.identifier),
      optional($.comment),
      '\n'
    ),

    lookup_statement: $ => prec(1, seq(
      field('key', $.key),
      '=',
      field('value', choice(
        $.value,
        prec(1, blank())
      )),
      optional($.comment),
      '\n'
    )),

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

    value: $ => token(prec(-1, /([^/\n]|\/[^/])+/)),

    display_definition: $ => prec(1, seq(
      $.display_definition_header,
      repeat($.conditional_display),
      optional($.default_display),
    )),

    display_definition_header: $ => seq('Display', ':', optional($.comment), '\n'),

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
      field('name', $.identifier),
      '(',
      $.logic,
      ')'
    ),

    //logic: $ => /[^?)]*/,
    logic: $ => seq(
      $.logic_group,
      repeat(seq(
        'S',
        $.logic_group
      ))
    ),

    logic_group: $ => seq(
      $.logic_condition,
      repeat(seq(
        '_',
        $.logic_condition
      ))
    ),

    logic_condition: $ => seq(
      optional(seq(
        $.logic_flag,
        ":"
      )),
      choice(
        $.logic_operand,
        seq(
          field('left', $.logic_operand),
          $.logic_operator,
          field('right', $.logic_operand)
      ))
    ),

    logic_flag: $ => choice(
      'P',    // Pause If
      'R',    // Reset If
      'Z',    // Reset Next If
      'A',    // Add Source
      'B',    // Sub Source
      'C',    // Add Hits
      'D',    // Sub Hits
      'I',    // Add Address
      'N',    // And Next
      'O',    // Or Next
      'M',    // Measured
      'Q',    // Measured If
      'T',    // Trigger
      'K',    // Remember
    ),

    logic_operand: $ => choice(
      field('recall', $.logic_recall),
      field('mem', $.logic_mem),
      field('value', $.logic_value)
    ),

    logic_recall: $ => /{recall}/,

    logic_mem: $ => seq(
      optional(field('type', $.logic_mem_type)),
      "0x",
      optional(field('size', $.logic_mem_size)), // no size == 16-bit
      field('address', $.logic_mem_address)
    ),

    logic_mem_type: $ => choice(
      'd',    // Delta
      'p',    // Prior
      'b',    // BCD
      '~',    // Invert
    ),

    logic_mem_size: $ => choice(
      'M',    // Bit0
      'N',    // Bit1
      'O',    // Bit2
      'P',    // Bit3
      'Q',    // Bit4
      'R',    // Bit5
      'S',    // Bit6
      'T',    // Bit7
      'L',    // Lower4
      'U',    // Upper4
      'H',    // 8-bit
      ' ',    // 16-bit
      'W',    // 24-bit
      'X',    // 32-bit
      'I',    // 16-bit BE
      'J',    // 24-bit BE
      'G',    // 32-bit BE
      'K',    // BitCount
    ),

    logic_mem_address: $ => /[0-9a-fA-F]+/,

    logic_value: $ => choice(
      /h[0-9a-fA-F]+/,
      /[0-9]+/
    ),

    logic_operator: $ => choice(
      "=", "!=", "<=", "<", ">=", ">",
      "+", "-", "*", "/", "%", "&", "^"
    ),

    text: $ => token(prec(1, /([^@\n?/]|\/[^/])+/)),
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    comment: $ => token(prec(2, seq('//', /[^\n]*/))),
  }
});
