<script>
  import { fetchPost } from "../utils/fetchUtil.js";
  import { navigate } from "svelte-routing";
  import { toast } from "@zerodevx/svelte-toast";
  import Button from "../lib/Button.svelte";
  import AvatarPicker from "../lib/AvatarPicker.svelte";
  import { onMount } from "svelte";
  import SecondaryButton from "../lib/SecondaryButton.svelte";

  let name = $state("Jens");
  let email = $state("jens@example.com");
  let pwd = $state("verystrongpassword!3729838734783");
  let repeatedPwd = $state("verystrongpassword!3729838734783");
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
      toast.push(`${"Welcome! Remember to verify you email."}`);
      navigate("/lists", { replace: true });
    }
  }

  onMount(() => {
    const cookieDialogDisplayed = localStorage.getItem("CookieDialogDisplayed");
    if (!cookieDialogDisplayed) {
      dialog.showModal();
      localStorage.setItem("CookieDialogDisplayed", true);
    }
  });
</script>

<dialog
  bind:this={dialog}
  class="m-auto rounded-2xl bg-white p-6 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
>
  <div class="flex flex-col items-center">
    <p class="font-semibold">🍪 This website uses cookies 🍪</p>
    <p class="mb-3">You accept cookies by signing in.</p>
    <Button onclick={() => dialog.close()}>OK!</Button>
  </div>
</dialog>

{#if !displayCreateProfile}
  <form id="sign-up-form" class="bg-stone-100 flex flex-col gap-6 p-6">
    <label>
      <div class="text-sm font-semibold mb-1">Name:</div>
      <input
        class="bg-white w-full rounded-lg px-2 py-1"
        type="text"
        bind:value={name}
        id="user-name"
        required
        placeholder="Your name…"
      />
    </label>
    <label>
      <div class="text-sm font-semibold mb-1">Email:</div>
      <input
        class="bg-white w-full rounded-lg px-2 py-1"
        type="email"
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
        bind:value={pwd}
        id="password"
        required
        placeholder="Your password…"
      />
    </label>
    <label>
      <div class="text-sm font-semibold mb-1">Repeat password:</div>
      <input
        class="bg-white w-full rounded-lg px-2 py-1"
        type="password"
        bind:value={repeatedPwd}
        id="password-repeated"
        required
        placeholder="Repeat your password…"
      />
    </label>
    <Button
      disabled={disableNextButton}
      onclick={() => (displayCreateProfile = true)}>Next</Button
    >
  </form>
{:else}
  <div class="bg-stone-100 flex flex-col gap-6 p-6">
    <AvatarPicker {setAvatar} {setColor} />
    <div class="flex justify-between">
      <SecondaryButton onclick={() => (displayCreateProfile = false)}
        >Back</SecondaryButton
      >
      <Button onclick={handleSignUp}>Sign up</Button>
    </div>
  </div>
{/if}
