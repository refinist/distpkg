import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/{index,run}.ts'],
  platform: 'node',
  dts: true,
  publint: true,
  fixedExtension: true
});
