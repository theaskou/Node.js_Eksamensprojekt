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

<form
  id="login-form"
  on:submit={handleLogin}
  class="bg-stone-100 flex flex-col gap-6 p-6"
>
  <label>
    <div class="text-sm font-semibold mb-1">Email:</div>
    <input
      class="bg-white w-full rounded-lg px-2 py-1"
      type="text"
      bind:value={email}
      id="email"
      required
      placeholder="Your email…"
    />
  </label>
  <label>
    <div class="text-sm font-semibold mb-1">Password:</div>
    <input
      class="bg-white w-full rounded-lg px-2 py-1"
      type="password"
      bind:value={password}
      id="password"
      required
      placeholder="Your password…"
    />
  </label>

  <Button>Log in</Button>
</form>
