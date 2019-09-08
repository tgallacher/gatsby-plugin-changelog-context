# gatsby-plugin-changelog-context

Automate adding a changelog of commit history to your Gatsby -generated pages.

---

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg?style=flat-square&logo=Github)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=flat-square)](https://github.com/tgallacher/gatsby-plugin-changelog-context/graphs/commit-activity)
![NPM version](https://img.shields.io/npm/v/gatsby-plugin-changelog-context.svg?style=flat)
![NPM license](https://img.shields.io/npm/l/gatsby-plugin-changelog-context.svg?style=flat)
[![Build Status](https://travis-ci.com/tgallacher/gatsby-plugin-changelog-context.svg?branch=master)](https://travis-ci.com/tgallacher/gatsby-plugin-changelog-context)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

---

Each page's commit history is added to your page templates via the [page context](https://www.gatsbyjs.org/docs/gatsby-internals-terminology/#pagecontext). This then gives you the ability to display/consume this data within your page template however you like.

<!-- TOC -->

- [Perquisites](#perquisites)
- [Install](#install)
  - [Add Dependency](#add-dependency)
  - [Add Plugin to GatsbyJS Site](#add-plugin-to-gatsbyjs-site)
  - [Adding Filesystem Data to your Page Query](#adding-filesystem-data-to-your-page-query)
- [Usage](#usage)
- [Credit](#credit)

<!-- /TOC -->

## Perquisites

This Gatsby plugin requires the location of each page with respect to the filesystem, as stored in git; This is to ensure we get the correct/relevant commit history for the page from git.

This is easy to add to a typical Gatsby setup, assuming you are using Gatsby with GraphQL. How to add this data is provided in more detail [below](<(#adding-filesystem-data-to-your-page-query)>).

## Install

### Add Dependency

Install using yarn/npm

```sh
npm install --save gatsby-plugin-changelog-context
# or
yarn add gatsby-plugin-changelog-context
```

and add the plugin to your config file:

### Add Plugin to GatsbyJS Site

```js
// gatsby-config.js
module.exports = {
  ...
  plugins: [
    'gatsby-plugin-changelog-context',
  ]
};
```

### Adding Filesystem Data to your Page Query

To ensure you get only commits for each page, separately, you need to ensure that your pages include the absolute path to the file containing the content, e.g. the Markdown file. You can do this by including the `edges.node.fileAbsolutePath` parameter in your GraphQL query.

For example, when programmatically generating pages from Markdown files, you can modify your [createPages](https://www.gatsbyjs.org/docs/node-apis/#createPages) node API call to add the required data:

```js
const { data, errors } = await graphql(`
  {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          fileAbsolutePath
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`);

// ...

const blogPostTemplate = path.resolve('./src/templates/blog-post.js');

data.allMarkdownRemark.edges.forEach(post => {
  createPage({
    path: post.node.fields.slug,
    component: blogPostTemplate,
    context: {
      slug: post.node.fields.slug,
      // required for [gatsby-plugin-changelog-context]
      fileAbsolutePath: post.node.fileAbsolutePath,
    },
  });
});
```

## Usage

The commit history for each page is accessed from the page template's `pageContext`. In the above example, which uses a page template, called `blogPostTemplate`, we can access the commit history via the `props.pageContext.changelog`:

```jsx
const BlogPostTemplate = ({ data, pageContext }) => {
  // ...

  <section>
    <h4>Changelog</h4>

    {pageContext.changelog.map(({ hash, date, message }) => (
      <p key={hash}>
        {moment(date).format('ddd Do MMM, YYYY')} - {message}
      </p>
    ))}
  </section>;

  // ...
};
```

The `changelog` prop has the following type signature:

```ts
type ChangeLog = Commit[]; // Empty array, or array of Commit objects

// Commit object
interface Commit {
  hash: string; // commit hash
  data: string; // ISO datetime
  message: string; // commit summary
  body: string; // commit body
  author_name: string;
  author_email: string;
  refs: string;
}
```

## Credit

This plugin was inspired by a tweet from [Søren Birkemeyer](https://twitter.com/polarbirke):

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I have added changelogs to my blog! 📋😎<br><br>Whenever I go back to a blog post to update or fix something, the commit message(s) are now automatically appended at the bottom of the page.<br><br>Here&#39;s how I did this with <a href="https://twitter.com/eleven_ty?ref_src=twsrc%5Etfw">@eleven_ty</a>: <br><br>👉 <a href="https://t.co/ObMC4waYKq">https://t.co/ObMC4waYKq</a><a href="https://twitter.com/hashtag/keepachangelog?src=hash&amp;ref_src=twsrc%5Etfw">#keepachangelog</a></p>&mdash; Søren Birkemeyer (@polarbirke) <a href="https://twitter.com/polarbirke/status/1169334048516444160?ref_src=twsrc%5Etfw">September 4, 2019</a></blockquote>
