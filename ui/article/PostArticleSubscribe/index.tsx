import { Paragraph } from "@ui/prose";
import SubscribeForm from "../SubscribeForm";
import { EMAIL_HREF, TWITTER_URL } from "@lib/links";

const PostArticleSubscribe = () => {
  return (
    <>
      <hr id="subscribe" className="my-12 md:my-20 border-ink-200"></hr>
      <Paragraph>
        If you liked this and would like to hear when new content is published,
        please subscribe below.
      </Paragraph>
      <Paragraph className="mb-12 sm:mb-16">
        If you have any feedback, found bugs, or just want to reach out, feel
        free to{" "}
        <a
          href={TWITTER_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="text-ink-800 hover:text-ink-900 underline underline-offset-1 decoration-ink-700"
        >
          DM me on Twitter
        </a>{" "}
        or{" "}
        <a
          href={EMAIL_HREF}
          target="_blank"
          rel="noreferrer noopener"
          className="text-ink-800 hover:text-ink-900 underline underline-offset-1 decoration-ink-700"
        >
          send me an email
        </a>
        .
      </Paragraph>
      <SubscribeForm />
    </>
  );
};

export default PostArticleSubscribe;
