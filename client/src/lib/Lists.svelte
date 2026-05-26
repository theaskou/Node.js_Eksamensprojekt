<script>
  import { onMount } from "svelte";
  import { fetchGet, fetchPost } from "../utils/fetchUtil";
  import { useLocation } from "svelte-routing";
  import Avatar from "./Avatar.svelte";
  import { resolveColor } from "./config/colors.js";
  import { navigate } from "svelte-routing";
  import logoutHandler from "../utils/logoutUtil";

  let { user } = $props();
  let userData = $state(null);
  let userLists = $state({});
  let resolvedColor = $derived(resolveColor(userData?.color));
  let memberAvatars = $state({});
  let newListName = $state("");
  let isEmptyString = $derived(newListName === null || newListName === "");
  let dialog;

  onMount(async () => {
    const userDataResult = await fetchGet("/users/me");
    userData = userDataResult;

    const listsResult = await fetchGet(`/users/${user.userID}/lists`);
    userLists = listsResult.data;
  });

  async function addHandler() {
    await fetchPost(`/lists`, { listName: newListName });
    const listsResult = await fetchGet(`/users/${user.userID}/lists`);
    userLists = listsResult.data;
    clearCurrentItem();
  }

  function clearCurrentItem() {
    newListName = "";
    dialog.close();
  }
</script>

{#if userData}
  <Avatar avatar={userData.avatar} color={resolvedColor} />
  <div>Signed in as {userData.userName}</div>
  <button class="log-out-button" onclick={logoutHandler}>Log out</button>
{/if}

<button
  class="create-list-button"
  command="show-modal"
  commandfor="create-list-dialog">Create list</button
>
<dialog id="create-list-dialog" bind:this={dialog}>
  <input type="text" bind:value={newListName} placeholder="Name your new list…" />
  <button onclick={clearCurrentItem}>Cancel</button>
  <button onclick={addHandler} disabled={isEmptyString}>Add</button>
</dialog>

<h1>Your lists:</h1>
<ul>
  {#each userLists as { listID, listName, members }}
    <li class="list">
      <button
        class="navigate-to-checklist-button"
        onclick={() => navigate(`/lists/${listID}`)}
      >
        {listName}
        <div class="member-avatars">
          {#each members as member}
            <Avatar
              avatar={member.avatar}
              color={resolveColor(member.color)}
              size={30}
            />
          {/each}
        </div>
      </button>
    </li>
  {/each}
</ul>
