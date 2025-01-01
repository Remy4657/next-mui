"use client";

import { useEffect, useState } from "react";

export interface TPost {
  title: string;
  description: string;
}

const Post = () => {
  const [listPost, setListPost] = useState<TPost[]>([]);

  const fetchListPost = async () => {
    const res = await fetch("http://localhost:3000/post/api").then((res) =>
      res.json()
    );
  };

  useEffect(() => {
    fetchListPost();
  }, []);

  return (
    <div>
      <h1>post</h1>
    </div>
  );
};
export default Post;
