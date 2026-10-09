import { startTransition, type FormEvent } from "react";

// Passing an action to <form action> makes React clear every field once it
// finishes — including when it returns a validation error. Submitting through
// onSubmit instead keeps what the person typed (and the photos they picked).
export function submitWithoutReset(action: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  };
}
