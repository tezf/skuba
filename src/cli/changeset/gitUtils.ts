// Adapted from https://github.com/changesets/action/blob/21240c3cd1d2efa2672d64e0235a03cf139b83e6/src/utils.ts

import git from 'isomorphic-git';

import {
  getChangedFiles,
  getHeadSha,
  gitAdd,
  gitBranch,
  gitCommit,
  gitDeleteBranch,
  gitListTags,
  gitPush,
  gitRemove,
  gitReset,
} from '../../utils/git';

import type * as github from './githubAdapter';

interface GitUser {
  name: string;
  email: string;
}

let gitUser: GitUser;

export const setUser = (_octokit: github.Octokit) => {
  // const user = await octokit.users.getAuthenticated();
  gitUser ??= {
    name: 'buildagencygitapitoken[bot]', // user.data.name as string
    email: '87109344+buildagencygitapitoken[bot]@users.noreply.github.com', // `${user.data.id}+${user.data.name}@users.noreply.github.com`
  };
};

export const push = async (
  dir: string,
  branch: string,
  token: string,
  { force }: { force?: boolean } = {},
) => {
  await gitPush({
    dir,
    auth: { type: 'gitHubApp', token },
    branch,
    commitOid: await getHeadSha(dir),
    force,
  });
};

export const listTags = async (dir: string): Promise<string[]> =>
  gitListTags({ dir });

export const pushTags = async (dir: string, tags: string[], token: string) => {
  await Promise.all(
    tags.map((tag) =>
      gitPush({
        auth: { type: 'gitHubApp', token },
        commitOid: tag,
        dir,
      }),
    ),
  );
};

export const switchToMaybeExistingBranch = async (
  dir: string,
  branch: string,
) => {
  try {
    await gitBranch({ dir, ref: branch, checkout: true });
  } catch (error) {
    if (error instanceof git.Errors.AlreadyExistsError) {
      await gitDeleteBranch({ dir, ref: branch });
      await gitBranch({ dir, ref: branch, checkout: true });
      return;
    }

    throw error;
  }
};

export const reset = async (dir: string, pathSpec: string, branch: string) => {
  await gitReset({ dir, branch, commitOid: pathSpec, hard: true });
};

export const commitAll = async (dir: string, message: string) => {
  const changedFiles = await getChangedFiles({ dir });
  await Promise.all(
    changedFiles.map((file) =>
      !file.deleted
        ? gitAdd({ dir, filepath: file.path })
        : gitRemove({ dir, filepath: file.path }),
    ),
  );

  await gitCommit({
    dir,
    message,
    author: { name: gitUser.name, email: gitUser.email },
    committer: { name: gitUser.name, email: gitUser.email },
  });
};

export const checkIfClean = async (dir: string): Promise<boolean> => {
  const changedFiles = await getChangedFiles({ dir });
  return !changedFiles.length;
};
