<script>
  import { onMount } from "svelte";
  import { fetchGet, fetchPost } from "../utils/fetchUtil";
  import { useLocation } from "svelte-routing";
  import Avatar from "../lib/Avatar.svelte";
  import { resolveColor } from "../lib/config/colors.js";
  import { navigate } from "svelte-routing";
  import logoutHandler from "../utils/logoutUtil";
  import { sortByDate } from "../utils/sortingUtil";
  import { currentListMembers } from "../stores/listMembersStore.js";
  import Button from "../lib/Button.svelte";
  import SecondaryButton from "../lib/SecondaryButton.svelte";
  import SignedInAs from "../lib/SignedInAs.svelte";

  let { user } = $props();
  let userData = $state(null);
  let userLists = $state([]);
  let sortedLists = $derived(sortByDate(userLists));
  let resolvedColor = $derived(resolveColor(userData?.color));
  let memberAvatars = $state({});
  let newListName = $state("");
  let isEmptyString = $derived(newListName === null || newListName === "");
  let dialog;

  onMount(async () => {
    const userDataResult = await fetchGet("/users/me");
    userData = userDataResult;

    const listsResult = await fetchGet(`/users/${user.userId}/lists`);
    userLists = listsResult.data;
  });

  async function addHandler() {
    await fetchPost(`/lists`, { listName: newListName });
    const listsResult = await fetchGet(`/users/${user.userId}/lists`);
    userLists = listsResult.data;
    clearCurrentItem();
  }

  function clearCurrentItem() {
    newListName = "";
    dialog.close();
  }

  function openList(list) {
    currentListMembers.set({
      listId: list.listId,
      listName: list.listName,
      members: list.members,
    });
    navigate(`/lists/${list.listId}`);
  }
</script>

<svelte:head>
  <title>Your lists</title>
</svelte:head>

{#if userData}
  <a href="/profile">
    <SignedInAs
      userName={userData.userName}
      avatar={userData.avatar}
      color={userData.color}
    />
  </a>
{/if}

<div class="flex justify-between items-center mt-6 mb-8">
  <h1 class="font-semibold text-2xl">Your lists:</h1>
  <Button command="show-modal" commandfor="create-list-dialog"
    >Create List</Button
  >
</div>

<dialog
  id="create-list-dialog"
  class="m-auto mx-3 max-w-lg rounded-2xl bg-white p-6 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
  bind:this={dialog}
>
  <label>
    <div class="mb-2 font-semibold">List name:</div>
    <input
      type="text"
      class="text-2xl w-full"
      bind:value={newListName}
      placeholder="Name your new list…"
    />
  </label>
  <div class="mt-4 flex justify-between">
    <SecondaryButton onclick={clearCurrentItem}>Cancel</SecondaryButton>
    <Button onclick={addHandler} disabled={isEmptyString}>Add</Button>
  </div>
</dialog>

<ul class="flex flex-col gap-3">
  {#each sortedLists as { listId, listName, members }}
    <li class="list">
      <button
        class="bg-stone-100 flex w-full justify-between p-4 rounded-xl font-semibold"
        onclick={() => openList({ listId, listName, members })}
      >
        {listName}
        <div class="flex gap-1">
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
