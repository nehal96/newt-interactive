import { FormEvent, useRef, useState } from "react";
import { Button } from "..";
import { cn } from "../../lib/utils";

interface SubscribeFormProps {
  /**
   * Same form either way — the variant only decides whether it's wrapped.
   * "bare" sits directly on the page (the homepage, where the colophon around
   * it is already quiet); "card" puts it in a panel, so at the foot of a long
   * article it reads as a thing to act on rather than one more paragraph.
   */
  variant?: "card" | "bare";
}

const SubscribeForm = ({ variant = "card" }: SubscribeFormProps) => {
  // 1. Create a reference to the input so we can fetch/clear it's value.
  const nameInputEl = useRef(null);
  const emailInputEl = useRef(null);
  // 2. Hold a message in state to handle the response from our API.
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const subscribe = async (e: FormEvent) => {
    e.preventDefault();

    // 3. Send a request to our API with the user's email address.
    const res = await fetch("/api/subscribe", {
      body: JSON.stringify({
        firstName: nameInputEl.current.value,
        email: emailInputEl.current.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { error } = await res.json();

    if (error) {
      // 4. If there was an error, update the message in state.
      setIsError(true);
      setMessage(error);
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // 5. Clear the input value and show a success message.
    nameInputEl.current.value = "";
    emailInputEl.current.value = "";
    setIsError(false);
    setMessage(
      "Success! Thanks for subscribing, check your email for a confirmation link."
    );
    setTimeout(() => setMessage(""), 3000);
  };

  const card = variant === "card";
  // White fields on paper and on the card's pale indigo alike — the panel is
  // tinted lightly enough that a filled field still needs its own outline.
  const inputClass =
    "py-2 px-3 rounded-md bg-white border border-ink-200 outline-none focus:border-ink-400";
  const labelClass = "mb-1 text-sm text-ink-500";

  return (
    <div
      className={cn(
        // Everything but the display serif is the interface sans; set here so
        // the labels and fields inherit it too.
        "w-full self-center font-ui",
        // The navbar's glass, unblurred and thinner: the same indigo, laid on
        // lightly enough that the paper still reads through it. The border goes
        // the other way — with a fill this faint, a firmer edge is what keeps
        // the thing reading as a card rather than as a wash.
        card &&
          "max-w-2xl rounded-xl border border-indigo-200/85 bg-indigo-50/50 p-6 sm:p-9"
      )}
    >
      <h3 className="font-title text-2xl text-ink-900 mb-2">
        Subscribe to Newt Interactive
      </h3>
      <p className="mb-4 text-[0.9375rem] text-ink-500">
        You'll only get emails when I publish new content. No spam, unsubscribe
        any time.
      </p>
      <form className="flex flex-col sm:flex-row" onSubmit={subscribe}>
        <div className="flex flex-col w-full sm:flex-row">
          <div className="flex flex-col mb-3 sm:mr-4 sm:mb-0 sm:w-1/4">
            <label className={labelClass} htmlFor="firstName">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              ref={nameInputEl}
              required
              type="text"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col mb-8 sm:mr-4 sm:mb-0 sm:w-1/2">
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              ref={emailInputEl}
              required
              type="email"
              className={inputClass}
            />
          </div>
          <Button
            className="w-full py-2 sm:w-1/4 sm:h-[40px] sm:self-end"
            variant="primary"
            type="submit"
          >
            Subscribe
          </Button>
        </div>
      </form>
      {message ? (
        <div
          className={`${
            isError
              ? "bg-red-100 text-red-900"
              : "bg-emerald-100 text-emerald-900"
          } rounded-lg mt-4 p-2 transition-all sm:flex-row`}
        >
          {message}
        </div>
      ) : null}
    </div>
  );
};

export default SubscribeForm;
