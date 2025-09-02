import { loadConfig } from 'c12';
import { defaultConfig } from './utils/default-config';

import type { UserConfig, UserConfigFn, CliOptions } from './utils/types';
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

export async function loadUserConfig(
  cliOptions: CliOptions
): Promise<UserConfig> {
  const defaults = defaultConfig();

  const { config: configFile, ...overrides } = cliOptions;
  const { config } = await loadConfig<UserConfig>({
    cwd: cliOptions.cwd,
    name: 'distpkg',
    context: JSON.parse(JSON.stringify(cliOptions)),
    configFile,
    defaults,
    overrides

    // merger: (...rest) => {
    //   // Do not use the default deep merge method
    //   // Merge in reverse order to ensure later items override earlier ones
    //   let obj = {};
    //   for (const item of rest.reverse()) {
    //     if (item) {
    //       // Filter out undefined and null values to ensure the merged object does not contain them
    //       const filteredItem = Object.fromEntries(
    //         Object.entries(item).filter(
    //           ([, value]) => value !== null && value !== undefined
    //         )
    //       );
    //       obj = { ...obj, ...filteredItem };
    //     }
    //   }
    //   return obj;
    // },
  });

  return config;
}
