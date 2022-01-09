import { Paragraph, SubscribeForm } from "..";

const PostArticleSubscribe = () => {
  return (
    <>
      <hr className="my-12 md:my-20 border-slate-200"></hr>
      <Paragraph>
        If you liked this and would like to hear when new content is published,
        please subscribe below.
      </Paragraph>
      <Paragraph className="mb-12 sm:mb-16">
        If you have any feedback, found bugs, or just want to reach out, feel
        free to{" "}
        <a
          href="https://www.twitter.com/nehaludyavar"
          target="_blank"
          rel="noreferrer noopener"
          className="text-slate-800 hover:text-slate-900 underline underline-offset-1 decoration-slate-700"
        >
          DM me on Twitter
        </a>{" "}
        or{" "}
        <a
          href={`mailto:nehal@newtinteractive.com?subject=${encodeURIComponent(
            "Hey! You're amazing!"
          )}`}
          target="_blank"
          rel="noreferrer noopener"
          className="text-slate-800 hover:text-slate-900 underline underline-offset-1 decoration-slate-700"
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
