import { readFile } from 'node:fs/promises';
import { up as findPackage } from 'empathic/package';
import type { PackageJson } from 'pkg-types';
import type { UserConfig } from '../config';
import path from 'node:path';
import { writeFileSync } from 'node:fs';

export async function readPackageJson(
  dir: string
): Promise<PackageJson | undefined> {
  const packageJsonPath = findPackage({ cwd: dir });
  if (!packageJsonPath) return;
  const contents = await readFile(packageJsonPath, 'utf8');
  return {
    ...JSON.parse(contents),
    packageJsonPath
  };
}

export function createDistPkg(config: UserConfig) {
  const { cwd, outDir, packageJson } = config as Required<UserConfig>;
  // 检查输出目录是否存在
  const outputPath = path.resolve(cwd, outDir);

  if (packageJson) {
    const packageJsonPath = path.resolve(outputPath, 'package.json');
    const packageJsonContent = JSON.stringify(packageJson, null, 2);
    writeFileSync(packageJsonPath, packageJsonContent, 'utf8');
  } else {
    throw new Error(`packageJson is not configured`);
  }
}
