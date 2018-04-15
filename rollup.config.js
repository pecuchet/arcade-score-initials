import pkg from './package.json';
import uglify from 'rollup-plugin-uglify';

export default [
    {
        input: 'src/InitialsFactory.js',
        output: [
            {file: pkg.main, format: 'es'},
            {file: pkg.umd, format: 'umd', name: 'ArcadeInitials'}
        ],
        plugins: [
            uglify()
        ]
    }
];