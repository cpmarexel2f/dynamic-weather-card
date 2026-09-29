#!/usr/bin/env bun
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const LOCALES_DIR = 'src/internationalization/locales';

type Json = Record<string, unknown>;

const flattenKeys = (obj: Json, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value !== null && typeof value === 'object'
      ? flattenKeys(value as Json, path)
      : [path];
  });

const flattenEmptyKeys = (obj: Json, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object') return flattenEmptyKeys(value as Json, path);
    return value === '' ? [path] : [];
  });

const readLocale = (code: string): Json =>
  JSON.parse(readFileSync(join(LOCALES_DIR, code, 'translation.json'), 'utf-8')) as Json;

const codes = readdirSync(LOCALES_DIR, { withFileTypes: true })
  .filter((e) => e.isDirectory() && existsSync(join(LOCALES_DIR, e.name, 'translation.json')))
  .map((e) => e.name)
  .sort();

const enKeys = new Set(flattenKeys(readLocale('en')));
let failed = false;

for (const code of codes) {
  let locale: Json;
  try {
    locale = readLocale(code);
  } catch (error) {
    console.error(`❌ ${code}: invalid JSON — ${String(error)}`);
    failed = true;
    continue;
  }

  const emptyKeys = flattenEmptyKeys(locale);
  if (emptyKeys.length > 0) {
    console.warn(`⚠️ ${code}: ${emptyKeys.length} empty value(s), will render blank: ${emptyKeys.slice(0, 5).join(', ')}${emptyKeys.length > 5 ? ', …' : ''}`);
  }

  if (code === 'en') continue;

  const keys = flattenKeys(locale);
  const extra = keys.filter((k) => !enKeys.has(k));
  const missing = [...enKeys].filter((k) => !keys.includes(k));

  if (extra.length > 0) {
    console.error(`❌ ${code}: keys not present in en: ${extra.join(', ')}`);
    failed = true;
  }
  if (missing.length > 0) {
    console.warn(`⚠️ ${code}: ${missing.length} missing key(s), en fallback applies: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? ', …' : ''}`);
  }
}

if (failed) process.exit(1);
console.log(`✅ ${codes.length} locales checked`);
