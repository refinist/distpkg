import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { getPackageJsonByPkgKeys } from './utils/package';
import { defaultConfig } from './utils/default-config';
import type { UserConfig } from './utils/types';

export async function createDistPkg(config?: UserConfig): Promise<{
  success: boolean;
  message: string | Error;
}> {
  let { cwd, outDir, packageJson, packageKeys, sort } =
    config as Required<UserConfig>;

  const outputPath = path.join(cwd, outDir);

  // Process packageJson using the latest merged packageKeys
  packageJson = {
    ...(await getPackageJsonByPkgKeys(packageKeys || [])),
    ...packageJson
  };

  if (sort) {
    const { default: sortPackageJson } = await import('sort-package-json');
    packageJson = sortPackageJson(packageJson);
  }

  const packageJsonPath = path.join(outputPath, 'package.json');
  const packageJsonContent = JSON.stringify(packageJson, null, 2);
  try {
    await writeFile(packageJsonPath, packageJsonContent, 'utf8');
    return { success: true, message: 'package.json written successfully' };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to write package.json'
    };
  }
}

export function build(
  config?: UserConfig
): Promise<Awaited<ReturnType<typeof createDistPkg>>> {
  const defaults = defaultConfig();
  // Merge pkgKeys, consistent with CLI behavior
  const { packageKeys = [], ...rest } = config || {};
  const finalConfig = {
    ...defaults,
    ...rest,
    packageKeys: [...defaults.packageKeys, ...packageKeys]
  };
  return createDistPkg(finalConfig);
}
