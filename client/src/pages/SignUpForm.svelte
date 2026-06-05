<script>
  import { fetchPost } from "../utils/fetchUtil.js";
  import { navigate } from "svelte-routing";
  import { toast } from "@zerodevx/svelte-toast";
  import { preventDefault } from "svelte/legacy";
  import Button from "../lib/Button.svelte";
  import AvatarPicker from "../lib/AvatarPicker.svelte";
  import { onMount } from "svelte";

  let name = $state("");
  let email = $state("");
  let pwd = $state("");
  let repeatedPwd = $state("");
  let selectedAvatar = $state("");
  let selectedColor = $state("");
  let dialog;
  let disableNextButton = $derived(
    name.length < 1 ||
      email.length < 1 ||
      pwd.length < 1 ||
      repeatedPwd.length < 1 ||
      pwd !== repeatedPwd,
  );
  let disableSignUpButton = $derived(!selectedAvatar || !selectedColor);
  let displayCreateProfile = $state(false);

  function setColor(color) {
    selectedColor = color;
  }

  function setAvatar(avatar) {
    selectedAvatar = avatar;
  }

  async function handleSignUp(event) {
    event.preventDefault();

    const response = await fetchPost("/users", {
      name,
      email,
      pwd,
      repeatedPwd,
      selectedAvatar,
      selectedColor,
    });

    if (response.error) {
      toast.push(`${response.error}`);
    } else {
      toast.push(`${response.message}`);
      navigate("/lists", { replace: true });
    }
  }

  onMount(() => {
    const cookieDialogDisplayed = localStorage.getItem("CookieDialogDisplayed");
    if (!cookieDialogDisplayed) {
      if (!cookieDialogDisplayed) {
        dialog.showModal();
        localStorage.setItem("CookieDialogDisplayed", true);
      }
    }
  });
</script>

<dialog
  bind:this={dialog}
  class="m-auto mx-3 max-w-lg rounded-2xl bg-white p-6 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
>
  <div class="flex flex-col items-center">
    <p class="font-semibold">🍪 This website uses cookies 🍪</p>
    <p class="mb-3">You accept cookies by signing in.</p>
    <Button onclick={() => dialog.close()}>OK!</Button>
  </div>
</dialog>

{#if !displayCreateProfile}
  <form id="sign-up-form">
    <label>
      Name:
      <input
        type="text"
        bind:value={name}
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
  </form>
  <Button
    disabled={disableNextButton}
    onclick={() => (displayCreateProfile = true)}>Next</Button
  >
{:else}
  <AvatarPicker {setAvatar} {setColor} />
  <Button onclick={() => (displayCreateProfile = false)}>Back</Button>
  <Button onclick={handleSignUp}>Sign up</Button>
{/if}
