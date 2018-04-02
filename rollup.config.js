import pkg from './package.json';

export default [
    {
        input: 'src/InitialsFactory.js',
        output: [
            {file: pkg.main, format: 'es'},
            {file: pkg.umd, format: 'umd', name: 'ArcadeInitials'}
        ]
    }
];