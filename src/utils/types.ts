import type { PackageJson } from 'pkg-types';

/**
 * Base Options
 */
export interface Options {
  /**
   * Package keys
   *
   * @default ['name', 'version', 'description', 'private', 'type']
   */
  packageKeys?: string[];

  /**
   * The config file
   *
   * @default 'distpkg.config.ts'
   */
  config?: string;

  /**
   * Directory to store build resources, usually 'dist'
   *
   * @default 'dist'
   */
  outDir?: string;

  /**
   * Current working directory
   *
   * @default process.cwd()
   */
  cwd?: string;

  /**
   * dist/package.json content
   */
  packageJson?: PackageJson;

  /**
   * Sort package.json
   *
   * @default true
   */
  sort?: boolean;
}

export type CliOptions = Omit<Options, 'packageJson'>;

export type UserConfig = Omit<Options, 'config'>;

export type UserConfigFn = (cliOptions: CliOptions) => Awaitable<UserConfig>;

export type Awaitable<T> = T | Promise<T>;
