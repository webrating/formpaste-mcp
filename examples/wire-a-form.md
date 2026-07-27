# Worked example: wire a form into a page

This walks through the full agent-visible loop for adding a Formpaste contact form to a page: create the form, get a snippet, paste it in, send a test submission, and confirm the form is wired correctly.

## 1. Create the form

Call `create_form` with a name for the form (and a destination email, if the agent has one to use).

```
create_form({ name: "Contact form" })
```

The response includes the form's id and access key, plus a wired snippet you can use directly. Creating a form with a new destination email also triggers verification of that email; it does not complete it. See the caveat at the end of this example before assuming a live form will deliver mail.

## 2. Get a snippet for the target stack

If you need the snippet in a different framework than the one returned by `create_form`, call `get_snippet` with the form's access key and the framework you want (`html`, `react`, `nextjs`, `astro`, `vue`, or `svelte`).

```
get_snippet({ access_key: "<access_key_from_step_1>", framework: "react" })
```

## 3. Paste the snippet into the page

Take the snippet returned in step 1 or step 2 and paste it into the page where the contact form should appear. This is a normal file edit in the project; no further tool calls are needed for this step.

## 4. Send a test submission

Once the snippet is in place, call `send_test_submission` to confirm the form accepts submissions end to end.

```
send_test_submission({ access_key: "<access_key_from_step_1>" })
```

This stores a test row only. No email is sent, no spam scoring runs, and it does not count toward quota. It proves the form is live and connected, not that email delivery works.

## 5. Confirm the form is wired correctly

Call `get_form` with the form's id or access key to check its configuration, including whether the destination email has been verified.

```
get_form({ access_key: "<access_key_from_step_1>" })
```

Check `destination_verified` in the response. If it is not yet true, real submissions will not be delivered by email until it is.

## Caveat: destination verification is not automatic

`create_form` triggers destination-email verification; it does not complete it. When a form is created with a new destination email, the form owner must open the Formpaste dashboard and confirm that destination before real submissions are delivered by email.

An agent wiring up a form on someone's behalf should not assume delivery works immediately just because `create_form` or `send_test_submission` succeeded. Tell the form owner to check their inbox for the verification email and confirm it in the dashboard, and use `get_form`'s `destination_verified` field to check the current state before declaring the integration done.
