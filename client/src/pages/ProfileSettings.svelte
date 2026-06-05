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

<dialog bind:this={deleteDialog}>
  <p>Are you sure you want to delete your account?</p>
  <p>All your lists and entries will be deleted.</p>
  <form>
    <p>Enter your password to delete your user:</p>
    <input
      type="password"
      bind:value={pwd}
      id="password"
      required
      placeholder="Your password…"
    />
    <DeleteButton onclick={deleteAccountHandler}>Delete my account</DeleteButton
    >
  </form>
  <SecondaryButton onclick={() => deleteDialog.close()}>Cancel</SecondaryButton>
</dialog>
