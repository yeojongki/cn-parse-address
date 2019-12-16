import babel from 'rollup-plugin-babel';
// import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';

const config = {
  input: 'src/parse/index.js',
  name: pkg.name,
  output: [],
  plugins: [
    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    })
  ]
};

if (isProd) {
  config.output.push(
    {
      name: pkg.name,
      file: `${pkg.browser}`,
      format: 'umd'
    },
    {
      file: `${pkg.main}`,
      format: 'cjs'
    },
    {
      file: `${pkg.module}`,
      format: 'esm'
    }
  );

  // config.plugins.push(terser());
} else {
  config.output.push({
    sourcemap: true,
    file: `dist/${pkg.name}.js`,
    format: 'cjs'
  });
}

export default config;
