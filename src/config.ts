import { loadConfig } from 'c12';
import type { PackageJson } from 'pkg-types';
import { readPackageJson } from './utils/package';
import type { Awaitable } from './utils/types';

/**
 * Options for distpkg
 */
export interface Options {
  /**
   * The config file
   */
  config?: string;

  /**
   * @default 'dist'
   */
  outDir?: string;

  /**
   * current working directory
   *
   * @default process.cwd()
   */
  cwd?: string;

  /**
   * dist/package.json content
   *
   * Defaults to `name`, `version`, and `private` from the current package.json
   */
  packageJson?: PackageJson;
}

export type CliOptions = Omit<Options, 'packageJson'>;

export type UserConfig = Omit<Options, 'config'>;

export type UserConfigFn = (options: Options) => Awaitable<UserConfig>;

/**
 * user input config
 */
export function defineConfig(options: UserConfig): UserConfig;
export function defineConfig(options: UserConfigFn): UserConfigFn;
export function defineConfig(
  options: UserConfig | UserConfigFn
): UserConfig | UserConfigFn {
  return options;
}

/**
 * default config
 */
const CWD = process.cwd();
const defaultConfig = async (): Promise<UserConfig> => {
  const packageJson = await readPackageJson(CWD);
  return {
    outDir: 'dist',
    cwd: CWD,
    packageJson: {
      name: packageJson?.name,
      version: packageJson?.version,
      private: packageJson?.private
    }
  };
};

export async function loadUserConfig(
  overrides?: Partial<UserConfig>,
  configFile?: string,
  cwd: string = CWD
): Promise<UserConfig> {
  const defaults = await defaultConfig();
  const result = await loadConfig<UserConfig>({
    name: 'distpkg',
    configFile,
    defaults,
    overrides,
    cwd
  });
  return result.config;
}
