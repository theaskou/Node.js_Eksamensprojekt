<script>
  import { navigate } from "svelte-routing";
  import logoutHandler from "../utils/logoutUtil";
  import Button from "./Button.svelte";

  let { inviteDialog, deleteDialog } = $props();

  let showMenu = $state(false);
</script>

<div class="relative">
  <Button onclick={() => (showMenu = !showMenu)}>…</Button>
  {#if showMenu}
    <ul
      class="absolute right-0 whitespace-nowrap p-4 mt-1.5 bg-blue-100 rounded-xl"
    >
      <li>
        <button
          onclick={() => inviteDialog.showModal()}
          class="m-1 font-semibold">Add collaborator</button
        >
      </li>
      <li>
        <button onclick={() => navigate(`/lists`)} class="m-1 font-semibold"
          >Back to lists</button
        >
      </li>
      <li>
        <button
          onclick={() => deleteDialog.showModal()}
          class="m-1 font-semibold text-red-700">Delete this list</button
        >
      </li>
      <li>
        <button onclick={logoutHandler} class="m-1 font-semibold"
          >Sign out</button
        >
      </li>
    </ul>
  {/if}
</div>
