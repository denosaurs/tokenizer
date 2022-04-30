import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { Tokenizer } from '../mod.ts';

const { test } = Deno;

test(function matchesSingleRegex() {
  const tokenizer = new Tokenizer("0123456789", [
    { type: "DIGITS", pattern: /\d+/ },
  ]);

  assertEquals(tokenizer.next(), {
    done: false,
    value: {
      type: "DIGITS",
      match: "0123456789",
      value: "0123456789",
      groups: [],
      position: { start: 0, end: 10 },
    },
  });
  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
});

test(function matchesMultipleRegex() {
  const tokenizer = new Tokenizer("0123456789 0123456789", [
    { type: "DIGITS", pattern: /\d+/ },
    { type: "SPACE", pattern: / / },
  ]);

  assertEquals(tokenizer.next(), {
    done: false,
    value: {
      type: "DIGITS",
      match: "0123456789",
      value: "0123456789",
      groups: [],
      position: { start: 0, end: 10 },
    },
  });
  assertEquals(tokenizer.next(), {
    done: false,
    value: {
      type: "SPACE",
      match: " ",
      value: " ",
      groups: [],
      position: { start: 10, end: 11 },
    },
  });
  assertEquals(tokenizer.next(), {
    done: false,
    value: {
      type: "DIGITS",
      match: "0123456789",
      value: "0123456789",
      groups: [],
      position: { start: 11, end: 21 },
    },
  });
  assertEquals(tokenizer.next(), { done: true, value: undefined });
});

test(function matchesSingleString() {
  const tokenizer = new Tokenizer("0123456789", [
    { type: "DIGITS", pattern: "0123456789" },
  ]);

  assertEquals(tokenizer.next(), {
    done: false,
    value: {
      type: "DIGITS",
      match: "0123456789",
      value: "0123456789",
      groups: [],
      position: { start: 0, end: 10 },
    },
  });
  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
});

test(function matchesMultipleString() {
  const tokenizer = new Tokenizer("0123456789 0123456789", [
    { type: "DIGITS", pattern: "0123456789" },
    { type: "SPACE", pattern: " " },
  ]);

  assertEquals(tokenizer.next(), {
    done: false,
    value: {
      type: "DIGITS",
      match: "0123456789",
      value: "0123456789",
      groups: [],
      position: { start: 0, end: 10 },
    },
  });
  assertEquals(tokenizer.next(), {
    done: false,
    value: {
      type: "SPACE",
      match: " ",
      value: " ",
      groups: [],
      position: { start: 10, end: 11 },
    },
  });
  assertEquals(tokenizer.next(), {
    done: false,
    value: {
      type: "DIGITS",
      match: "0123456789",
      value: "0123456789",
      groups: [],
      position: { start: 11, end: 21 },
    },
  });
  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
});

test(function matchesSingleFunctionPattern() {
  const tokenizer = new Tokenizer('"0123456789 abcdef"', [
    {
      type: "STRING",
      pattern: (text: string): string | undefined => {
        if (text.startsWith('"')) {
          let i = 1;
          let out = '"';

          while (i < text.length && text.charAt(i) !== '"') {
            out += text.charAt(i);
            i++;
          }

          out += '"';
          return out;
        } else {
          return undefined;
        }
      },
    },
  ]);

  assertEquals(tokenizer.next(), {
    done: false,
    value: {
      type: "STRING",
      match: '"0123456789 abcdef"',
      value: '"0123456789 abcdef"',
      groups: [],
      position: { start: 0, end: 19 },
    },
  });
  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
});

test(function matchesMultipleFunctionPattern() {
  const tokenizer = new Tokenizer('"0123456789 abcdef" "0123456789 abcdef"', [
    {
      type: "STRING",
      pattern: (text: string): string | undefined => {
        if (text.startsWith('"')) {
          let i = 1;
          let out = '"';

          while (i < text.length && text.charAt(i) !== '"') {
            out += text.charAt(i);
            i++;
          }

          out += '"';
          return out;
        } else {
          return undefined;
        }
      },
    },
    {
      type: "SPACE",
      pattern: (text: string): string | undefined => {
        let i = 0;
        let out = "";

        while (i < text.length && text.charAt(i) === " ") {
          out += text.charAt(i);
          i++;
        }

        return out;
      },
    },
  ]);

  assertEquals(tokenizer.next(), {
    done: false,
    value: {
      type: "STRING",
      match: '"0123456789 abcdef"',
      value: '"0123456789 abcdef"',
      groups: [],
      position: { start: 0, end: 19 },
    },
  });
  assertEquals(tokenizer.next(), {
    done: false,
    value: {
      type: "SPACE",
      match: " ",
      value: " ",
      groups: [],
      position: { start: 19, end: 20 },
    },
  });
  assertEquals(tokenizer.next(), {
    done: false,
    value: {
      type: "STRING",
      match: '"0123456789 abcdef"',
      value: '"0123456789 abcdef"',
      groups: [],
      position: { start: 20, end: 39 },
    },
  });
  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
});

test(function ignoresSingleRegex() {
  const tokenizer = new Tokenizer("0123456789", [
    { type: "", pattern: /\d+/ },
  ]);

  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
});

test(function ignoresMultipleRegex() {
  const tokenizer = new Tokenizer("0123456789 0123456789", [
    { type: "", pattern: /\d+/ },
    { type: "", pattern: / / },
  ]);

  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
});

test(function ignoresSingleString() {
  const tokenizer = new Tokenizer("0123456789", [
    { type: "", pattern: "0123456789" },
  ]);

  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
});

test(function ignoresMultipleString() {
  const tokenizer = new Tokenizer("0123456789 0123456789", [
    { type: "", pattern: "0123456789" },
    { type: "", pattern: " " },
  ]);

  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
});

test(function ignoresSingleFunctionPattern() {
  const tokenizer = new Tokenizer('"0123456789 abcdef"', [
    {
      type: "",
      pattern: (text: string): string | undefined => {
        if (text.startsWith('"')) {
          let i = 1;
          let out = '"';

          while (i < text.length && text.charAt(i) !== '"') {
            out += text.charAt(i);
            i++;
          }

          out += '"';
          return out;
        } else {
          return undefined;
        }
      },
    },
  ]);

  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
});

test(function ignoresMultipleFunctionPattern() {
  const tokenizer = new Tokenizer('"0123456789 abcdef" "0123456789 abcdef"', [
    {
      type: "",
      pattern: (text: string): string | undefined => {
        if (text.startsWith('"')) {
          let i = 1;
          let out = '"';

          while (i < text.length && text.charAt(i) !== '"') {
            out += text.charAt(i);
            i++;
          }

          out += '"';
          return out;
        } else {
          return undefined;
        }
      },
    },
    {
      type: "",
      pattern: (text: string): string | undefined => {
        let i = 0;
        let out = "";

        while (i < text.length && text.charAt(i) === " ") {
          out += text.charAt(i);
          i++;
        }

        return out;
      },
    },
  ]);

  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
  assertEquals(tokenizer.next(), {
    done: true,
    value: undefined,
  });
});

test(function testIterable() {
  const tokenizer = new Tokenizer("0123456789 0123456789", [
    { type: "DIGITS", pattern: /\d+/ },
    { type: "SPACE", pattern: / / },
  ]);

  assertEquals(
    [...tokenizer],
    [
      {
        type: "DIGITS",
        match: "0123456789",
        value: "0123456789",
        groups: [],
        position: { start: 0, end: 10 },
      },
      {
        type: "SPACE",
        match: " ",
        value: " ",
        groups: [],
        position: { start: 10, end: 11 },
      },
      {
        type: "DIGITS",
        match: "0123456789",
        value: "0123456789",
        groups: [],
        position: { start: 11, end: 21 },
      },
    ],
  );
});

test(function testMixed() {
  const tokenizer = new Tokenizer(
    `123
        456abc
        ABCDEF GHIJKL "ABCDEF asdasd" a -1 "hello world"`,
    [
      { type: "space", pattern: /\s+/, ignore: true },

      { type: "keywords", pattern: ["ABCDEF", "GHIJKL"] },
      { type: "identifier", pattern: /[a-zA-Z_]+/ },
      {
        type: "integer",
        pattern: /-?[0-9]+/,
        value: (m: { match: string }) => parseInt(m.match),
      },
      {
        type: "string",
        pattern: /"(.*?[^\\])"/,
        value: (m: { groups: any[] }) => m.groups[0],
      },
    ],
  );

  assertEquals(
    [...tokenizer],
    [
      {
        type: "integer",
        match: "123",
        value: 123,
        groups: [],
        position: { start: 0, end: 3 },
      },
      {
        type: "integer",
        match: "456",
        value: 456,
        groups: [],
        position: { start: 12, end: 15 },
      },
      {
        type: "identifier",
        match: "abc",
        value: "abc",
        groups: [],
        position: { start: 15, end: 18 },
      },
      {
        type: "keywords",
        match: "ABCDEF",
        value: "ABCDEF",
        groups: [],
        position: { start: 27, end: 33 },
      },
      {
        type: "keywords",
        match: "GHIJKL",
        value: "GHIJKL",
        groups: [],
        position: { start: 34, end: 40 },
      },
      {
        type: "string",
        match: '"ABCDEF asdasd"',
        value: "ABCDEF asdasd",
        groups: ["ABCDEF asdasd"],
        position: { start: 41, end: 56 },
      },
      {
        type: "identifier",
        match: "a",
        value: "a",
        groups: [],
        position: { start: 57, end: 58 },
      },
      {
        type: "integer",
        match: "-1",
        value: -1,
        groups: [],
        position: { start: 59, end: 61 },
      },
      {
        type: "string",
        match: '"hello world"',
        value: "hello world",
        groups: ["hello world"],
        position: { start: 62, end: 75 },
      },
    ],
  );
});
