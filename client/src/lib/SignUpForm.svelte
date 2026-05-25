<script>
  import { fetchPost } from "../utils/fetchUtil.js";
  import { navigate } from "svelte-routing";
  import { toast } from "@zerodevx/svelte-toast";

  let userName = "";
  let email = "";
  let pwd = "";
  let repeatedPwd = "";

  async function handleSignUp(event) {
    event.preventDefault();

    const response = await fetchPost("/users", {
      userName,
      email,
      pwd,
      repeatedPwd,
    });

    if (response.error) {
      toast.push(`${response.error}`);
    } else {
      navigate("/welcome", { replace: true });
    }
  }
</script>

<form id="sign-up-form" on:submit={handleSignUp}>
  <label>
    Username:
    <input
      type="text"
      bind:value={userName}
      id="user-name"
      required
      placeholder="Your username…"
    />
  </label>
  <label>
    Email:
    <input
      type="email"
      bind:value={email}
      id="email"
      required
      placeholder="Your email…"
    />
  </label>
  <label>
    Password:
    <input
      type="password"
      bind:value={pwd}
      id="password"
      required
      placeholder="Your password…"
    />
  </label>
  <label>
    Repeat password:
    <input
      type="password"
      bind:value={repeatedPwd}
      id="password-repeated"
      required
      placeholder="Repeat your password…"
    />
  </label>
  <button id="sign-up-button">Sign up</button>
</form>
