import { FormEvent, useRef, useState } from "react";
import { Button } from "..";

const SubscribeForm = () => {
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

  return (
    <div className="w-full self-center max-w-2xl border border-slate-100 bg-slate-100 rounded-lg p-6 sm:p-9">
      <h3 className="font-bold md:text-lg mb-3">
        Subscribe to Newt Interactive
      </h3>
      <p className="text-sm md:text-base text-slate-700 mb-4">
        You'll only get emails when I publish new content. No spam, unsubscribe
        any time.
      </p>
      <form className="flex flex-col sm:flex-row" onSubmit={subscribe}>
        <div className="flex flex-col w-full sm:flex-row">
          <div className="flex flex-col mb-3 sm:mr-4 sm:mb-0 sm:w-1/4">
            <label
              className="font-medium text-slate-800 mb-1"
              htmlFor="firstName"
            >
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              ref={nameInputEl}
              required
              type="text"
              className="py-2 px-3 rounded-md"
            />
          </div>
          <div className="flex flex-col mb-8 sm:mr-4 sm:mb-0 sm:w-1/2">
            <label className="font-medium text-slate-800 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              ref={emailInputEl}
              required
              type="email"
              className="py-2 px-3 rounded-md"
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
