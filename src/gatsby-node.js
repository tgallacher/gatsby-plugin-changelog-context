const git = require('simple-git/promise');

/**
 * Retrieve the commit history for a given file.
 *
 * @param {string} path path to file to get log
 * @param {object | undefined} opts Optional options to pass to the `git log` call
 */
const getChangelog = async (path, opts) => {
  const gitOpts = Object.assign(
    {},
    {
      'file': path,
      '--date': 'iso8601-strict',
      // Override default format so we can change the datetime format
      // This is required as `simple-git` is pretty printing the log.
      //
      // We use the `%cd` pretty print config to make the datetime format adhere to the `--date` switch
      'format': {
        hash: '%H',
        message: '%s',
        refs: '%D',
        body: '%b',
        date: '%cd',
        author_name: '%aN',
        author_email: '%ae',
      },
    },
    opts,
  );

  const { all: changelog } = await git().log(gitOpts);

  return changelog ? changelog : [];
};

/**
 *
 * @param {object} helpers Gatsby Node API helpers
 * @param {object} options Plugin options
 * @param {object} options.git Options to pass to the git command
 */
exports.onCreatePage = async (
  { page, actions: { createPage, deletePage }, reporter },
  { git: gitOpts },
) => {
  if (!page.context.fileAbsolutePath) {
    return reporter.info(
      `[gatsby-plugin-changelog-context]: No "fileAbsolutePath" context found for page: ${page.path}`,
    );
  }

  try {
    const changelog = await getChangelog(
      page.context.fileAbsolutePath,
      gitOpts,
    );

    deletePage(page);
    createPage({
      ...page,
      context: {
        ...page.context,
        changelog,
      },
    });
  } catch (err) {
    reporter.error(err);
  }

  return;
};
