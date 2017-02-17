module.exports = {
  external: ['penguin.js', 'xtend'],
  plugins: [require('rollup-plugin-buble')()],
  format: 'es'
}
