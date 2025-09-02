import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/{index,run}.ts'],
  platform: 'node',
  dts: true,
  unused: {
    level: 'error',
    ignore: ['typescript']
  },
  publint: true,
  fixedExtension: true
});
