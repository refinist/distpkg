import { defineConfig } from './src/config.ts';

export default defineConfig(() => ({
  packageJson: {
    dependencies: {
      foo: '^6.6.6',
      bar: '2.0.0'
    }
  }
}));
