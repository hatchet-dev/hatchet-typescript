import { Worker, WorkerOptions } from 'worker_threads';
import path from 'path';

export function runThreaded(scriptPath: string, options: WorkerOptions) {
  const resolvedPath = require.resolve(scriptPath);

  const isTs = /\.ts$/.test(resolvedPath);

  const ex = isTs
    ? `
    const wk = require('worker_threads');
    require('tsconfig-paths/register');
    require('ts-node').register({
      "include": ["src/**/*.ts"],
      "exclude": ["./dist"],
      "compilerOptions": {
        "types": ["node"],
        "target": "es2016",
        "esModuleInterop": true,
        "module": "commonjs",
        "rootDir": "${path.join(__dirname, '../../../')}",
      }
    });
    let file = '${resolvedPath}';
    require(file);
    `
    : resolvedPath;

  return new Worker(ex, {
    ...options,
    eval: isTs,
  });
}

// execArgv:  ? ['--require', 'ts-node/register'] : undefined,
