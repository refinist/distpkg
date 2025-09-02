import { join } from 'node:path';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { defineConfig, loadUserConfig } from '../src/config';
import { build, createDistPkg } from '../src/build';
import { getPackageJsonByPkgKeys } from '../src/utils/package';
import { defaultConfig } from '../src/utils/default-config';
import { DEFAULT_PKG_KEYS } from '../src/utils/default-pkg-keys';
import type { UserConfig, CliOptions } from '../src/utils/types';

describe('Config functionality tests', () => {
  describe('defineConfig', () => {
    it('should handle static config correctly', () => {
      const config: UserConfig = {
        outDir: 'build',
        packageJson: { name: 'test' }
      };
      const result = defineConfig(config);
      expect(result).toEqual(config);
    });

    it('should handle function config correctly', () => {
      const configFn = () => ({
        outDir: 'build',
        packageJson: { name: 'test' }
      });

      const result = defineConfig(configFn);
      expect(result).toBe(configFn);
    });
  });

  describe('loadUserConfig', () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = await import('node:fs/promises').then(fs =>
        fs.mkdtemp(join(tmpdir(), 'distpkg-test-'))
      );
    });

    afterEach(async () => {
      await rm(tempDir, { recursive: true, force: true });
    });

    it('should merge CLI options and override default config', async () => {
      const cliOptions: CliOptions = {
        cwd: tempDir,
        outDir: 'build',
        packageKeys: ['license'],
        sort: false
      };

      const config = await loadUserConfig(cliOptions);

      expect(config.cwd).toBe(tempDir);
      expect(config.outDir).toBe('build');
      expect(config.packageKeys).toContain('license');
      expect(config.sort).toBe(false);
    });

    it('should handle config file', async () => {
      const configPath = join(tempDir, 'distpkg-test.config.ts');
      await writeFile(configPath, 'export default { outDir: "build" };');

      const cliOptions: CliOptions = {
        cwd: tempDir,
        config: configPath
      };

      const config = await loadUserConfig(cliOptions);
      expect(config.cwd).toBe(tempDir);
      expect(config.outDir).toBe('build');
    });
  });
});

describe('Build functionality tests', () => {
  let tempDir: string;
  let outputDir: string;

  beforeEach(async () => {
    tempDir = await import('node:fs/promises').then(fs =>
      fs.mkdtemp(join(tmpdir(), 'distpkg-build-test-'))
    );
    outputDir = join(tempDir, 'build');
    await mkdir(outputDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  describe('createDistPkg function tests', () => {
    it('should handle undefined packageKeys', async () => {
      const config: UserConfig = {
        cwd: tempDir,
        outDir: 'build',
        packageJson: { name: 'test-package' }
      };

      await createDistPkg(config);

      const packageJsonPath = join(outputDir, 'package.json');
      const content = await readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(content);

      expect(packageJson.name).toBe('test-package');
    });
  });

  describe('build function tests', () => {
    it('should merge default config and user config', async () => {
      const config: UserConfig = {
        cwd: tempDir,
        outDir: 'build',
        packageJson: { name: 'test-package' },
        packageKeys: ['license'],
        sort: true
      };

      const result = await build(config);

      expect(result.success).toBe(true);

      const packageJsonPath = join(outputDir, 'package.json');
      const content = await readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(content);

      expect(packageJson.name).toBe('test-package');
      expect(packageJson.license).toBeDefined();
    });

    it('should handle case when no config is passed', async () => {
      const result = await build();
      expect(result).toBeDefined();
      expect(result.success).toBeDefined();
    });
  });
});

describe('Utility function tests', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await import('node:fs/promises').then(fs =>
      fs.mkdtemp(join(tmpdir(), 'distpkg-utils-test-'))
    );
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  describe('getPackageJsonByPkgKeys', () => {
    it('should extract fields based on specified keys', async () => {
      const packageJson = {
        name: 'test-package',
        version: '1.0.0',
        license: 'MIT'
      };

      await writeFile(
        join(tempDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      const result = await getPackageJsonByPkgKeys(
        ['name', 'license'],
        tempDir
      );

      expect(result).toEqual({
        name: 'test-package',
        license: 'MIT'
      });
    });

    it('should use default cwd parameter', async () => {
      const result = await getPackageJsonByPkgKeys(['name', 'version']);
      expect(result.name).toBeDefined();
      expect(result.version).toBeDefined();
    });

    it('should handle empty packageKeys', async () => {
      const result = await getPackageJsonByPkgKeys([], tempDir);
      expect(result).toEqual({});
    });
  });
});

describe('Default config tests', () => {
  it('should return correct default config', () => {
    const config = defaultConfig();

    expect(config.packageKeys).toEqual(DEFAULT_PKG_KEYS);
    expect(config.outDir).toBe('dist');
    expect(config.cwd).toBe(process.cwd());
    expect(config.packageJson).toEqual({});
    expect(config.sort).toBe(true);
  });
});

describe('CLI functionality tests', () => {
  let tempDir: string;
  let outputDir: string;

  beforeEach(async () => {
    tempDir = await import('node:fs/promises').then(fs =>
      fs.mkdtemp(join(tmpdir(), 'distpkg-cli-test-'))
    );
    outputDir = join(tempDir, 'build');
    await mkdir(outputDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('should execute CLI command successfully', async () => {
    const { runCLI } = await import('../src/cli');

    process.argv = [
      'node',
      'distpkg',
      'name',
      'version',
      '--cwd',
      tempDir,
      '--out-dir',
      'build'
    ];

    await expect(runCLI()).resolves.toBeUndefined();

    const packageJsonPath = join(outputDir, 'package.json');
    const content = await readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(content);

    expect(packageJson.name).toBeDefined();
    expect(packageJson.version).toBeDefined();
  });

  it('should handle build failure errors', async () => {
    const { runCLI } = await import('../src/cli');

    process.argv = [
      'node',
      'distpkg',
      '--cwd',
      '/nonexistent/path',
      '--out-dir',
      'build'
    ];

    try {
      await runCLI();
    } catch (error) {
      expect(error instanceof Error ? error.message : String(error)).toEqual(
        'process.exit unexpectedly called with "1"'
      );
    }
  });
});

describe('Entry file tests', () => {
  it('should be able to import all modules', async () => {
    const indexModule = await import('../src/index');
    expect(indexModule.defineConfig).toBeDefined();
    expect(indexModule.build).toBeDefined();
  });
});
