import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { RichText } from "prismic-dom";

import getPrismicClient from "../../services/prismic";

import styles from "./post.module.scss";

type Post = {
  title: string;
  slug: string;
  content: string;
  updatedAt: string;
};

interface PostProps {
  post: Post;
}

export default function Post({
  post: { title, content, updatedAt },
}: PostProps) {
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
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });
  const { slug } = params;

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const prismic = getPrismicClient();
  const res = await prismic.getByUID("post", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(res.data.title),
    content: RichText.asHtml(res.data.content),
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
  };
};
