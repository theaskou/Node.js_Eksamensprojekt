<script>
  import { onMount, onDestroy } from "svelte";
  import {
    fetchGet,
    fetchPost,
    fetchPut,
    fetchDelete,
  } from "../utils/fetchUtil";
  import { sortByDate } from "../utils/sortingUtil.js";
  import Avatar from "../lib/Avatar.svelte";
  import { resolveColor } from "../lib/config/colors.js";
  import { currentListMembers } from "../stores/listMembersStore.js";
  import io from "socket.io-client";
  import { writable } from "svelte/store";
  import Button from "../lib/Button.svelte";
  import SecondaryButton from "../lib/SecondaryButton.svelte";
  import DeleteButton from "../lib/DeleteButton.svelte";
  import logoutHandler from "../utils/logoutUtil";
  import { navigate } from "svelte-routing";
  import { preventDefault } from "svelte/legacy";
  import { toast } from "@zerodevx/svelte-toast";
  const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

  let { user, listId } = $props();
  let listItems = $state([]);
  let sortedItems = $derived(sortByDate(listItems));
  let listName = $state("");
  let itemDialog;
  let inviteDialog;
  let deleteDialog;
  let recieverEmail = $state("");
  let showMenu = $state(false);
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
    listItems = result.listItems ?? [];
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

    socket = io(SERVER_BASE_URL, {
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
    itemDialog.showModal();
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
    itemDialog.close();
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

  async function deleteItemHandler() {
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

  async function deleteListHandler() {
    const deletion = await fetchDelete(`/lists/${listId}`).then(
      navigate(`/lists`, { replace: true }),
    );
  }

  let inviteError = $state("");

  async function sendInvitationHandler(event) {
    event.preventDefault();
    const sendEmail = await fetchPost(`/lists/${listId}/invite`, {
      email: recieverEmail,
    });
    if (sendEmail.error) {
      inviteError = sendEmail.error;
    } else {
      inviteError = "";
      inviteDialog.close();
      toast.push(sendEmail.message);
    }
  }
</script>

<div class="flex justify-between">
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
</div>

<dialog
  bind:this={inviteDialog}
  class="m-auto mx-3 w-[calc(100%-1.5rem)] max-w-lg rounded-2xl bg-white p-6 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
>
  <form onsubmit={sendInvitationHandler}>
    <div class="text-2xl w-full mb-2.5">Send an invitation by email:</div>
    <input
      bind:value={recieverEmail}
      type="email"
      class="text-2xl w-full"
      placeholder="Collaborator's email…"
    />
    {#if inviteError}
      <p class="text-red-500 text-sm mt-2">{inviteError}</p>
    {/if}
    <div class="mt-4 gap-10 flex justify-center">
      <SecondaryButton type="button" onclick={() => inviteDialog.close()}
        >Cancel</SecondaryButton
      >
      <Button type="submit">Send invitation</Button>
    </div>
  </form>
</dialog>

<dialog
  bind:this={deleteDialog}
  class="m-auto mx-3 w-[calc(100%-1.5rem)] max-w-lg rounded-2xl bg-white p-6 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
>
  <div class="text-2xl font-semibold w-full">
    Are you sure you want to delete this list?
  </div>
  <div class="mt-4 gap-10 flex justify-center">
    <DeleteButton onclick={deleteListHandler}>Yes</DeleteButton>
    <Button onclick={() => deleteDialog.close()}>No</Button>
  </div>
</dialog>

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
            commandfor="add-edit-item-dialog">✏️</button
          >
        </div>
      </label>
    </li>
  {/each}
</ul>
<div class="fixed left-[calc(50%-24px)] bottom-4">
  <Button onclick={openAddDialog}>+</Button>
</div>

<dialog
  id="add-edit-item-dialog"
  bind:this={itemDialog}
  class="m-auto mx-3 w-[calc(100%-1.5rem)] max-w-lg rounded-2xl bg-white p-6 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
>
  <input
    type="text"
    class="text-2xl w-full"
    bind:value={currentItemText}
    placeholder="…"
  />
  <div class="mt-4 flex justify-between">
    <SecondaryButton onclick={clearCurrentItem}>Cancel</SecondaryButton>
    {#if currentItemIndex !== null}
      <DeleteButton onclick={() => deleteItemHandler()}>Delete</DeleteButton>
      <Button onclick={saveHandler} disabled={isEmptyString}>Save</Button>
    {:else}
      <Button onclick={addHandler} disabled={isEmptyString}>Add</Button>
    {/if}
  </div>
</dialog>
