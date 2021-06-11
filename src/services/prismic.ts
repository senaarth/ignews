import Prismic from "@prismicio/client";

export default function getPrismicClient() {
  const prismic = Prismic.client(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_KEY,
  });

  return prismic;
}
