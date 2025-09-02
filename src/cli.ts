import process from 'node:process';
import { cac } from 'cac';
import { version } from '../package.json';
import { loadUserConfig } from './config';
import { createDistPkg } from './build';
import type { CliOptions } from './utils/types';

const cli = cac('distpkg');
cli.help().version(version);

cli
  .command(
    '[...package-keys]',
    'Keys to copy from project package.json to dist/package.json',
    {
      ignoreOptionDefaultValue: true
    }
  )
  .option('-c, --config <filename>', 'Use a custom config file')
  .option('-d, --out-dir <dir>', 'Output directory', { default: 'dist' })
  .option('--cwd <dir>', 'Working directory', { default: process.cwd() })
  .option('-s, --sort', 'Sort package.json', { default: true })
  .action(async (input: string[], flags: CliOptions) => {
    try {
      const finalConfig = await loadUserConfig({
        packageKeys: input.length > 0 ? input : [],
        config: flags.config,
        outDir: flags.outDir,
        cwd: flags.cwd,
        sort: flags.sort
      });
      const { success, message } = await createDistPkg(finalConfig);
      if (!success) throw message;
    } catch (error) {
      console.error(
        /* c8 ignore next */
        `[distpkg] ${error instanceof Error ? error.message : error}`
      );
      process.exit(1);
    }
  });

export async function runCLI(): Promise<void> {
  try {
    cli.parse(process.argv, { run: false });
    await cli.runMatchedCommand();
  } catch (error) {
    console.error(
      '[distpkg] %s\nSee --help for a list of available commands.',
      /* c8 ignore next */
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}
