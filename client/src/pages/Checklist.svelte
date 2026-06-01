<script>
  import { onMount, onDestroy } from "svelte";
  import {
    fetchGet,
    fetchPost,
    fetchPut,
    fetchDelete,
  } from "../utils/fetchUtil";
  import { SERVER_BASE_URL } from "../stores/generalStore";
  import { sortByDate } from "../utils/sortingUtil.js";
  import Avatar from "../lib/Avatar.svelte";
  import { resolveColor } from "../lib/config/colors.js";
  import { currentListMembers } from "../stores/listMembersStore.js";
  import io from "socket.io-client";
  import { writable } from "svelte/store";
  import Button from "../lib/Button.svelte";

  // Back to lists view

  let { user, listId } = $props();
  let listItems = $state([]);
  let sortedItems = $derived(sortByDate(listItems));
  let listName = $state("");
  let dialog;
  let currentItemText = $state(null);
  let currentItemIndex = $state(null);
  let isEmptyString = $derived(
    currentItemText === null || currentItemText === "",
  );
  let socket;
  const onlineMemberIds = writable([]);
  const usersTyping = writable([]);

  async function fetchListItems() {
    const result = await fetchGet(`/lists/${listId}/items`);
    listItems = result.listItems;
    listName = result.listName;
  }

  onMount(async () => {
    fetchListItems();

    if (!$currentListMembers) {
      const result = await fetchGet(`/lists/${listId}/members`);
      currentListMembers.set({
        listId: result.listId,
        listName: result.listName,
        members: result.members,
      });
    }

    socket = io($SERVER_BASE_URL, {
      auth: {
        userId: user.userId,
      },
      withCredentials: true,
    });

    socket.on("user-connected", ({ userId }) => {
      onlineMemberIds.set([userId, ...$onlineMemberIds]);
    });

    socket.on("user-list", (onlineUsers) => {
      onlineMemberIds.set([user.userId, ...onlineUsers]);
    });

    socket.on("checklist-updated", () => {
      fetchListItems();
    });

    socket.on("user-is-typing", ({ userId }) => {
      const member = $currentListMembers?.members.find(
        (m) => m.memberId === userId,
      );
      if (member) usersTyping.update((members) => [member, ...members]);
    });

    socket.on("user-stopped-typing", ({ userId }) => {
      usersTyping.update((members) =>
        members.filter((m) => m.memberId !== userId),
      );
    });

    socket.on("user-disconnected", ({ userId }) => {
      onlineMemberIds.set($onlineMemberIds.filter((id) => id !== userId));
    });
  });

  onDestroy(() => {
    socket.disconnect();
  });

  function openAddDialog() {
    dialog.showModal();
    socket.emit("user-is-typing");
  }

  async function addHandler() {
    await fetchPost(`/lists/${listId}/listitems`, {
      itemName: currentItemText,
    });
    const result = await fetchGet(`/lists/${listId}/items`);
    listItems = result.listItems;
    socket.emit("checklist-updated");
    socket.emit("user-is-typing");
    clearCurrentItem();
  }

  function clearCurrentItem() {
    currentItemText = null;
    currentItemIndex = null;
    socket.emit("user-stopped-typing");
    dialog.close();
  }

  function editHandler(item) {
    currentItemText = item.itemName;
    currentItemIndex = item.itemID;
    socket.emit("user-is-typing");
  }

  async function saveHandler() {
    await fetchPut(`/lists/${listId}/listitems/${currentItemIndex}`, {
      itemName: currentItemText,
    });
    const item = listItems.find((i) => i.itemID === currentItemIndex);
    item.itemName = currentItemText;
    socket.emit("checklist-updated");
    clearCurrentItem();
  }

  async function deleteHandler() {
    await fetchDelete(`/lists/${listId}/listitems/${currentItemIndex}`);
    const index = listItems.findIndex((i) => i.itemID === currentItemIndex);
    listItems.splice(index, 1);
    socket.emit("checklist-updated");
    clearCurrentItem();
  }

  async function checkHandler(item) {
    const updateCheck = item.checked ? 0 : 1;
    await fetchPut(`/lists/${listId}/listitems/${item.itemID}/checked`, {
      checked: updateCheck,
    });
    const currentItem = listItems.find((i) => i.itemID === item.itemID);
    currentItem.checked = !item.checked;
    currentItem.checkedByColor = !item.checked
      ? resolveColor(user.color)
      : null;
    socket.emit("checklist-updated");
  }
</script>

<div class="members-list-container">
  <ul class="flex gap-5">
    {#if $currentListMembers && $onlineMemberIds}
      {#each $currentListMembers.members as member}
        <li>
          <Avatar
            avatar={member.avatar}
            color={resolveColor(member.color)}
            size={40}
          />
          <div class="flex">
            {member.userName}
            {#if $onlineMemberIds.includes(member.memberId)}
              <div
                class=""
                style="background-color: green; border-radius: 50%; width: 6px; height: 6px;"
              ></div>
            {/if}
          </div>
        </li>
      {/each}
    {/if}
  </ul>
</div>

<h1 class="font-semibold text-2xl mt-4 mb-4">{listName}</h1>

<ul class="flex flex-col justify-between gap-2 pb-20">
  {#each $usersTyping as member}
    <div style="color: {resolveColor(member.color)}">
      <Avatar avatar={member.avatar} color="none" size={30} />
      {member.userName} is typing...
    </div>
  {/each}
  {#each sortedItems as item}
    <li class="border-b border-stone-300">
      <label>
        <div class="flex justify-between">
          <div class="flex">
            <input
              type="checkbox"
              checked={item.checked}
              onchange={() => checkHandler(item)}
              style="accent-color: {resolveColor(item.checkedByColor) ??
                resolveColor(user.color)}"
            />
            <div
              class="ml-5 font-semibold {item.checked
                ? 'line-through text-stone-400'
                : ''}"
            >
              {item.itemName}
            </div>
          </div>
          <button
            class="flex"
            onclick={() => editHandler(item)}
            command="show-modal"
            commandfor="add-item-dialog">✏️</button
          >
        </div>
      </label>
    </li>
  {/each}
</ul>
<div class="fixed left-[calc(50%-24px)] bottom-4">
  <Button onclick={openAddDialog}>+</Button>
</div>

<dialog id="add-item-dialog" bind:this={dialog}>
  <input type="text" bind:value={currentItemText} placeholder="…" />
  <button onclick={clearCurrentItem}>Cancel</button>
  {#if currentItemIndex !== null}
    <button onclick={() => deleteHandler()}>Delete</button>
    <button onclick={saveHandler} disabled={isEmptyString}>Save</button>
  {:else}
    <button onclick={addHandler} disabled={isEmptyString}>Add</button>
  {/if}
</dialog>
