import process from 'node:process';
import { cac } from 'cac';
import { version } from '../package.json';
import { loadUserConfig, type CliOptions } from './config';
import { createDistPkg } from './utils/package';

const cli = cac('distpkg');
cli.help().version(version);

cli
  .command('', 'No command required', {
    ignoreOptionDefaultValue: true
  })
  .option('-c, --config <filename>', 'Use a custom config file')
  .option('-d, --out-dir <dir>', 'Output directory', { default: 'dist' })
  .option('--cwd <dir>', 'Working directory', { default: process.cwd() })
  .action(async (flags: CliOptions) => {
    try {
      const finalConfig = await loadUserConfig(
        {
          outDir: flags.outDir,
          cwd: flags.cwd
        },
        flags.config
      );
      createDistPkg(finalConfig);
    } catch (error) {
      console.error(
        `[distpkg] ${error instanceof Error ? error.message : String(error)}`
      );
      process.exit(1);
    }
  });

export async function runCLI(): Promise<void> {
  try {
    cli.parse(process.argv, { run: true });
    await cli.runMatchedCommand();
  } catch (error) {
    console.error(
      '[distpkg] %s\nSee --help for a list of available commands.',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}
