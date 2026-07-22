/* eslint-disable @typescript-eslint/no-require-imports */
import '@testing-library/jest-dom';
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

