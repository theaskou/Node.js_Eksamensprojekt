<script>
  import { onMount } from "svelte";
  import { toast } from "@zerodevx/svelte-toast";
  import Button from "../lib/Button.svelte";
  import DeleteButton from "../lib/DeleteButton.svelte";
  import SecondaryButton from "../lib/SecondaryButton.svelte";
  import { fetchGet, fetchDelete } from "../utils/fetchUtil";
  import logoutHandler from "../utils/logoutUtil";
  import { navigate } from "svelte-routing";
  import SignedInAs from "../lib/SignedInAs.svelte";

  let { user } = $props();
  let userData = $state(null);
  let pwd = $state("");
  let deleteDialog;

  onMount(async () => {
    const userDataResult = await fetchGet("/users/me");
    userData = userDataResult;
  });

  async function deleteAccountHandler(event) {
    event.preventDefault();

    const result = await fetchDelete(`users/${user.userId}`, { pwd });

    if (result.error) {
      toast.push(result.error);
    } else {
      toast.push("Your account was deleted.");
      navigate("/", { replace: true });
    }
  }
</script>

<div class="flex flex-col gap-6">
  {#if userData}
    <SignedInAs
      userName={userData.userName}
      avatar={userData.avatar}
      color={userData.color}
    />
  {/if}

  <Button onclick={logoutHandler}>Sign out</Button>

  <DeleteButton onclick={() => deleteDialog.showModal()}
    >Delete my account</DeleteButton
  >
</div>

<dialog
  bind:this={deleteDialog}
  class="m-auto mx-3 max-w-lg rounded-2xl bg-white p-6 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
>
  <div class="flex flex-col gap-6">
    <p>⚠️ Are you sure you want to delete your account?</p>
    <p>All your lists and entries will be deleted.</p>
    <form>
      <label>
        <div class="text-sm font-semibold mb-1">
          Enter your password to delete your user:
        </div>
        <input
          class="bg-stone-100 w-full rounded-lg px-2 py-1"
          type="password"
          bind:value={pwd}
          id="password"
          required
          placeholder="Your password…"
        />
      </label>
    </form>
    <DeleteButton onclick={deleteAccountHandler}>Delete my account</DeleteButton
    >
    <Button onclick={() => deleteDialog.close()}>Cancel</Button>
  </div>
</dialog>
