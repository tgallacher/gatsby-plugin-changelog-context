const git = require('simple-git/promise');

const getChangelog = async path => {
  const { all: changelog } = await git().log({ file: path });

  return changelog ? changelog : [];
};

exports.onCreatePage = async ({
  page,
  actions: { createPage, deletePage },
  reporter,
}) => {
  if (!page.context.fileAbsolutePath) {
    reporter.info(
      `[gatsby-plugin-changelog-context]: No "fileAbsolutePath" context found for page: ${page.path}`,
    );

    return; // do nothing
  }

  try {
    const changelog = await getChangelog(page.context.fileAbsolutePath);

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
