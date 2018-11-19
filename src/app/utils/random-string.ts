function getRandomBytes(n: number): Uint8Array {
  const crypto = window.crypto || (window as any).msCrypto;
  const quota = 65536;
  const a = new Uint8Array(n);
  for (let i = 0; i < n; i += quota) {
    crypto.getRandomValues(a.subarray(i, i + Math.min(n - i, quota)));
  }

  return a;
}

function extend<T, U>(first: T, second: U): T & U {
  // const result = <T & U>{};
  // for (const id in first) {
  //   if (id in first) {
  //     (<any>result)[id] = (<any>first)[id];
  //   }
  // }
  const result = <T & U>first;
  for (const id in second) {
    if (!result.hasOwnProperty(id)) {
      (<any>result)[id] = (<any>second)[id];
    }
  }

  return result;
}

export interface RandomStringBase {
  (length?: number): string;
  entropy: (bits: number) => string;
  charset: string;
}

function makeGenerator(charset: string): RandomStringBase {
  if (charset.length < 2) {
    throw new Error('charset must have at least 2 characters');
  }

  const generate = (length?: number): string => {
    if (!length) {
      return generate.entropy(128);
    }

    let out = '';
    const charsLen = charset.length;
    const maxBytes = 256 - (256 % charsLen);
    while (length > 0) {
      const buf = getRandomBytes(Math.ceil((length * 256) / maxBytes));
      for (let i = 0; i < buf.length && length > 0; i++) {
        const randomByte = buf[i];
        if (randomByte < maxBytes) {
          out += charset.charAt(randomByte % charsLen);
          length--;
        }
      }
    }

    return out;
  };

  generate.entropy = (bits: number): string => {
    return generate(Math.ceil(bits / (Math.log(charset.length) / Math.LN2)));
  };

  generate.charset = charset;
  return generate;
}

const TESTS = {
  length: (fn: RandomStringBase) => {
    if (fn().length !== fn.entropy(128).length) {
      throw new Error('Bad result for zero length');
    }

    for (let i = 1; i < 32; i++) {
      if (fn(i).length !== i) {
        throw new Error(`Length differ: ${i}`);
      }
    }
  },
  chars: (fn: RandomStringBase) => {
    const chars = Array.prototype.map.call(fn.charset, x => {
      return '\\u' + ('0000' + x.charCodeAt(0).toString(16)).substr(-4);
    });
    const re = new RegExp('^[' + chars.join('') + ']+$');
    if (!re.test(fn(256))) {
      throw new Error(`Bad chars for ${fn.charset}`);
    }
  },
  entropy: (fn: RandomStringBase) => {
    const len = fn.entropy(128).length;
    if (len * (Math.log(fn.charset.length) / Math.LN2) < 128) {
      throw new Error(`Wrong length for entropy: ${len}`);
    }
  },
  uniqueness: (fn: RandomStringBase, quick: boolean) => {
    const uniq = {};
    for (let i = 0; i < (quick ? 10 : 10000); i++) {
      const s = fn();
      if (uniq[s]) {
        throw new Error(`Repeated result: ${s}`);
      }

      uniq[s] = true;
    }
  },
  bias: (fn: RandomStringBase, quick: boolean) => {
    if (!quick) {
      let s = '';
      const counts = {};
      for (let i = 0; i < 1000; i++) {
        s += fn(1000);
      }

      for (let i = 0; i < s.length; i++) {
        const c = s.charAt(i);
        counts[c] = (counts[c] || 0) + 1;
      }

      const avg = s.length / fn.charset.length;
      for (const k in counts) {
        if (k in counts) {
          const diff = counts[k] / avg;
          if (diff < 0.95 || diff > 1.05) {
            throw new Error(`Biased '${k}': average is ${avg}, got ${counts[k]} in ${fn.charset}`);
          }
        }
      }
    }
  },
};

const numbers = '0123456789';
const letters = 'abcdefghijklmnopqrstuvwxyz';
const CHARSETS = {
  numeric: numbers,
  hex: numbers + 'abcdef',
  alphalower: letters,
  alpha: letters + letters.toUpperCase(),
  alphanumeric: numbers + letters + letters.toUpperCase(),
  base64: numbers + letters + letters.toUpperCase() + '+/',
  url: numbers + letters + letters.toUpperCase() + '-_',
};

export interface RandomString extends RandomStringBase {
  numeric: RandomStringBase;
  hex: RandomStringBase;
  alphalower: RandomStringBase;
  alpha: RandomStringBase;
  alphanumeric: RandomStringBase;
  base64: RandomStringBase;
  url: RandomStringBase;
  custom: (charset: string) => RandomStringBase;
  test: (quick: boolean) => void;
}

export const randomString: RandomString = extend(makeGenerator(numbers + letters + letters.toUpperCase()), {
  numeric: makeGenerator(numbers),
  hex: makeGenerator(numbers + 'abcdef'),
  alphalower: makeGenerator(letters),
  alpha: makeGenerator(letters + letters.toUpperCase()),
  alphanumeric: makeGenerator(numbers + letters + letters.toUpperCase()),
  base64: makeGenerator(numbers + letters + letters.toUpperCase() + '+/'),
  url: makeGenerator(numbers + letters + letters.toUpperCase() + '-_'),
  custom: makeGenerator,
  test: (quick: boolean) => {
    for (const test in TESTS) {
      if (test in TESTS) {
        const t = TESTS[test];
        t(randomString, quick);
        t(randomString.custom('abc'), quick);
        for (const cname in CHARSETS) {
          if (cname in CHARSETS) {
            t(randomString[cname], quick);
          }
        }
      }
    }
  },
});
