<script>
  import { fetchPost } from "../utils/fetchUtil.js";
  import { navigate } from "svelte-routing";
  import { toast } from "@zerodevx/svelte-toast";

  let userName = "";
  let email = "";
  let pwd = "";
  let repeatedPwd = "";

  async function handleSignUp() {

    const response = await fetchPost("/users", {
      userName,
      email,
      pwd,
      repeatedPwd,
    });

    if (response.error) {
      toast.push(`${response.error}`);
    } else {
      navigate("/createprofile", { replace: true });
      toast.push(`${response.status}`)
    }
  }
</script>

<form id="sign-up-form" on:submit={handleSignUp}>
  <label>
    Name:
    <input
      type="text"
      bind:value={userName}
      id="user-name"
      required
      placeholder="Your name…"
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
