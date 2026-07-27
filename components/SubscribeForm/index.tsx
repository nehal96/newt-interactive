import { FormEvent, useRef, useState } from "react";
import { Button } from "..";
import { cn } from "../../lib/utils";

interface SubscribeFormProps {
  /** "card" is the filled panel used after articles; "bare" sits on the page. */
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

  const bare = variant === "bare";
  // In the card the filled panel supplies the contrast; on bare paper the
  // fields need their own outline.
  const inputClass = cn(
    "py-2 px-3 rounded-md",
    bare && "bg-white border border-ink-200 outline-none focus:border-ink-400"
  );
  const labelClass = cn(
    "mb-1",
    bare ? "text-sm text-ink-500" : "font-medium text-slate-800"
  );

  return (
    <div
      className={cn(
        "w-full self-center",
        bare
          ? // On the homepage everything but the display serif is the interface
            // sans; set it here so the labels and fields inherit it too.
            "font-ui"
          : "max-w-2xl border border-slate-100 bg-slate-100 rounded-lg p-6 sm:p-9"
      )}
    >
      <h3
        className={cn(
          bare
            ? "font-title text-2xl text-ink-900 mb-2"
            : "font-bold md:text-lg mb-3"
        )}
      >
        Subscribe to Newt Interactive
      </h3>
      <p
        className={cn(
          "mb-4",
          bare ? "text-[0.9375rem] text-ink-500" : "text-sm md:text-base text-slate-700"
        )}
      >
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
