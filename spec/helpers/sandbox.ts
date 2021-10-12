// Copyright 2021 Google Inc. Use of this source code is governed by an
// MIT-style license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

import {promises as fs} from 'fs';
import {resolve} from 'path';
import * as del from 'del';

import {PromiseOr} from '../../lib/src/utils';

const sandboxDir = resolve('sandbox');

/**
 * Runs `test` within a sandbox directory.
 *
 * Handles all buildup and teardown. Returns a promise that resolves when `test`
 * finishes running.
 */
export async function run(
  test: () => PromiseOr<void>,
  options?: {
    // Directories to put in the SASS_PATH env variable before running test.
    sassPathDirs?: string[];
  }
): Promise<void> {
  const currDir = process.cwd();

  del.sync(sandboxDir); // TODO(awjin): Use fs.rmSync() when we drop support for Node 12
  await fs.mkdir(sandboxDir);
  process.chdir(sandboxDir);

  if (options?.sassPathDirs) {
    process.env.SASS_PATH = options.sassPathDirs.join(
      process.platform === 'win32' ? ';' : ':'
    );
  }

  try {
    await test();
  } finally {
    if (options?.sassPathDirs) {
      process.env.SASS_PATH = undefined;
    }
    process.chdir(currDir);
    del.sync(sandboxDir); // TODO(awjin): Use fs.rmSync() when we drop support for Node 12
  }
}
