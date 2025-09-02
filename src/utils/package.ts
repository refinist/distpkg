import { readFile } from 'node:fs/promises';
import { up as findPackage } from 'empathic/package';
import type { PackageJson } from 'pkg-types';

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

export async function getPackageJsonByPkgKeys(
  packageKeys: string[],
  cwd: string = process.cwd()
): Promise<PackageJson> {
  const fromPkgJson = await readPackageJson(cwd);
  const pkgKeys = packageKeys.filter(key => fromPkgJson?.[key]);
  const packageJson: PackageJson = pkgKeys.reduce(
    (acc, key) => ({ ...acc, [key]: fromPkgJson?.[key] }),
    {}
  );
  return packageJson;
}
