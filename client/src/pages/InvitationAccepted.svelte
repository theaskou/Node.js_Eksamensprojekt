<script>
  import { onMount } from "svelte";
  import { fetchPost } from "../utils/fetchUtil";
  import { toast } from "@zerodevx/svelte-toast";
  import Button from "../lib/Button.svelte";

  let userAddedToList = $state(false);

  async function acceptInvitationHandler() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    const listId = urlParams.get("listId");
    const token = urlParams.get("token");

    const result = await fetchPost(`/lists/${listId}/members`, {
      userId,
      token,
    });

    if (result.error) {
      toast.push(result.error);
      return;
    }
    userAddedToList = true;
  }
</script>

<h1>Collaborate with someone on the list</h1>

{#if !userAddedToList}
  <div class="m-auto">
    <h1 class="font-semibold text-2xl mb-8">
      Click the button to accept the invitation:
    </h1>

    <Button onclick={acceptInvitationHandler}>Accept invitation</Button>
  </div>
{:else}
  <h1 class="font-semibold text-2xl ml-5 mt-4 mb-4">
    You were added to the list!
  </h1>

  <a href="/lists" class="text-blue-700 ml-5"
    >Click here to see your lists, or to sign in.</a
  >
{/if}
