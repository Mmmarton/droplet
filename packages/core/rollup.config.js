import babel from 'rollup-plugin-babel';

export default {
  input: 'src/droplet.js',
  output: {
    file: 'build/droplet.js',
    format: 'cjs'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
};
