<script>
  import { onMount } from "svelte";
  import {
    fetchGet,
    fetchPost,
    fetchPut,
    fetchDelete,
  } from "../utils/fetchUtil";
  import { sortByDate } from "../utils/sortingUtil.js";
  import { resolveColor } from "../lib/config/colors.js";

  // Online users, users typing...

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

  onMount(async () => {
    const result = await fetchGet(`/lists/${listId}/items`);
    listItems = result.listItems;
    listName = result.listName;
  });

  async function addHandler() {
    await fetchPost(`/lists/${listId}/listitems`, {
      itemName: currentItemText,
    });

    const result = await fetchGet(`/lists/${listId}/items`);
    listItems = result.listItems;
    clearCurrentItem();
  }

  function clearCurrentItem() {
    currentItemText = null;
    currentItemIndex = null;
    dialog.close();
  }

  function editHandler(item) {
    currentItemText = item.itemName;
    currentItemIndex = item.itemID;
  }

  async function saveHandler() {
    await fetchPut(`/lists/${listId}/listitems/${currentItemIndex}`, {
      itemName: currentItemText,
    });

    const item = listItems.find((i) => i.itemID === currentItemIndex);
    item.itemName = currentItemText;
    clearCurrentItem();
  }

  async function deleteHandler() {
    await fetchDelete(`/lists/${listId}/listitems/${currentItemIndex}`);
    const index = listItems.findIndex((i) => i.itemID === currentItemIndex);
    listItems.splice(index, 1);
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
  }
</script>

<h1 class="list-name">{listName}</h1>

<ul class="list">
  {#each sortedItems as item}
    <li class="list-item">
      <label>
        <div>
          <input
            type="checkbox"
            checked={item.checked}
            onchange={() => checkHandler(item)}
            style="accent-color: {resolveColor(item.checkedByColor) ??
              resolveColor(user.color)}"
          />
          {item.itemName}
        </div>
        <button
          class="edit-button"
          onclick={() => editHandler(item)}
          command="show-modal"
          commandfor="add-item-dialog">✏️</button
        >
      </label>
    </li>
  {/each}
</ul>

<button class="add-button" command="show-modal" commandfor="add-item-dialog"
  >+</button
>

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

<style>
  .edit-button {
    background-color: transparent;
    border: none;
  }

  .list-name {
    margin: 12px;
  }

  .list {
    padding: 0;
    margin-bottom: 74px;
  }

  .list-item {
    list-style: none;
    padding-left: 12px;
  }

  .list-item > label {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .add-button {
    bottom: 12px;
    right: 12px;
    position: fixed;
    width: 50px;
    height: 50px;
  }

  input[type="checkbox"] {
    accent-color: unset;
  }
</style>
