import { GetStaticProps } from "next";
import { useSession } from "next-auth/client";
import React from "react";
import Head from "next/head";
import { RichText } from "prismic-dom";
import Link from "next/link";

import getPrismicClient from "../../../services/prismic";

import styles from "../post.module.scss";
import { useRouter } from "next/router";

type Post = {
  title: string;
  slug: string;
  content: string;
  updatedAt: string;
};

interface PostPreviewProps {
  post: Post;
}

export default function PostPreview({
  post: { slug, title, content, updatedAt },
}: PostPreviewProps) {
  const [session] = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{title} | ig.news</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.postContainer}>
          <h1>{title}</h1>
          <time>{updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a href="">Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const res = await prismic.getByUID("post", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(res.data.title),
    content: RichText.asHtml(res.data.content.splice(0, 3)),
    updatedAt: new Date(res.last_publication_date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 minutes
  };
};
