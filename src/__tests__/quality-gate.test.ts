/**
 * M1 AC-012 品質關卡：typecheck script 存在，CI 不得吞掉 lint／typecheck／test／build 的失敗。
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')) as {
  scripts: Record<string, string>;
};
const ci = readFileSync(path.join(root, '.github/workflows/ci.yml'), 'utf8');

/** 取出某個 job 區塊的文字（到下一個同層 job 為止）。 */
function jobBlock(name: string): string {
  const match = ci.match(new RegExp(`\\n  ${name}:\\n([\\s\\S]*?)(?=\\n  [a-z-]+:\\n|$)`));
  return match ? match[1] : '';
}

describe('M1 AC-012 品質關卡', () => {
  it('AC-012 package.json 有 typecheck script（tsc --noEmit）', () => {
    expect(pkg.scripts.typecheck).toBe('tsc --noEmit');
  });

  it('AC-012 lint、test、build script 仍存在', () => {
    expect(pkg.scripts.lint).toBeTruthy();
    expect(pkg.scripts.test).toBe('vitest run');
    expect(pkg.scripts.build).toBe('next build');
  });

  it('AC-012 CI 不再以 `|| echo` 吞掉測試失敗', () => {
    expect(ci).not.toContain('no test script');
    expect(ci).not.toMatch(/npm (run )?(test|lint|typecheck|build)[^\n]*\|\|/);
  });

  it('AC-012 CI 的 lint 不得 continue-on-error', () => {
    expect(ci).not.toMatch(/continue-on-error:\s*true/);
  });

  it.each([
    ['lint', 'npm run lint'],
    ['typecheck', 'npm run typecheck'],
    ['test', 'npm test'],
    ['build', 'npm run build'],
  ])('AC-012 CI 有 %s job 並執行 `%s`', (job, command) => {
    expect(jobBlock(job)).toContain(`- run: ${command}`);
  });

  it('AC-012 build 需等 lint、typecheck、test 全過', () => {
    expect(jobBlock('build')).toMatch(/needs:\s*\[lint, typecheck, test\]/);
  });
});
