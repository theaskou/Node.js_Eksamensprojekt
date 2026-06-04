<script>
  import { fetchPost } from "../utils/fetchUtil.js";
  import { navigate } from "svelte-routing";
  import { toast } from "@zerodevx/svelte-toast";
  import Button from "../lib/Button.svelte";

  let email = "";
  let password = "";

  async function handleLogin(event) {
    event.preventDefault();

    const response = await fetchPost("/login", { email, password });

    if (response.error) {
      toast.push(`${response.error}`);
    } else {
      navigate("/lists", { replace: true });
    }
  }
</script>

<form id="login-form" on:submit={handleLogin}>
  <label>
    Email:
    <input
      type="text"
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
      bind:value={password}
      id="password"
      required
      placeholder="Your password…"
    />
  </label>

<Button>Log in</Button>
</form>
