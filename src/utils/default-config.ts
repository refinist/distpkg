import { DEFAULT_PKG_KEYS } from './default-pkg-keys';
import type { UserConfig } from './types';

/**
 * default config
 */
export function defaultConfig(): Required<UserConfig> {
  return {
    packageKeys: DEFAULT_PKG_KEYS,
    outDir: 'dist',
    cwd: process.cwd(),
    packageJson: {},
    sort: true
  };
}
