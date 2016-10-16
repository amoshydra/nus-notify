'use babel';

import React, { PropTypes } from 'react';
import DOMPurify from 'dompurify';
import styles from './post.css';

const Post = ({ post }) => (
  <li style={{ margin: '20px 0', listStyle: 'none' }}>
    <div style={{ fontSize: '0.6em' }}>{post.Poster.Name}</div>
    <div
      style={{ padding: '10px', backgroundColor: 'white', border: '2px solid rgba(0,0,0,0.2)' }}
      className={styles.body}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(fixForumPost(post.PostBody)) }}
    />
  </li>
);

export default Post;

Post.propTypes = {
  post: PropTypes.object
};


function fixForumPost(htmlStr) {
  htmlStr = fixQuotedPost(htmlStr);
  htmlStr = fixImageUrl(htmlStr);
  return htmlStr;
}

function fixQuotedPost(htmlStr) {
  htmlStr = htmlStr.replace(/\[quser\]/g, '<div class="quser" style="font-size: 0.6em; padding: 10px; border: 2px solid grey"><div>');
  htmlStr = htmlStr.replace(/\[\/quser\]/g, '</div>');
  htmlStr = htmlStr.replace(/\[quote[0-9]?\]/g, '<div class="qpost" style="border: 2px solid lightgrey">');
  htmlStr = htmlStr.replace(/\[\/quote\]/g, '</div></div>');
  return htmlStr;
}

function fixImageUrl(htmlStr) {
  return htmlStr.replace(/src="(\/)/g, 'src="https://ivle.nus.edu.sg/');
}
