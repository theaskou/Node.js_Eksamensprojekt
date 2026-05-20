<script>
  // fetch checklist items

  // Online users, users typing...

  // Back to lists view

  // (?) Make sure the last list viewed is the start view when reopening the application (?)

  const listName = "Indkøbsliste";
  let dialog;

  let listItems = $state(["Koriander", "Chili", "Tofu", "Risnudler"]);
  let currentItemText = $state(null);
  let currentItemIndex = $state(null);
  let isEmptyString = $derived(
    currentItemText === null || currentItemText === "",
  );

  function addHandler() {
    listItems = [...listItems, currentItemText];
    clearCurrentItem();
  }

  function clearCurrentItem() {
    currentItemText = null;
    currentItemIndex = null;
    dialog.close();
  }

  function editHandler(index) {
    currentItemText = listItems[index];
    currentItemIndex = index;
  }

  function saveHandler() {
    listItems[currentItemIndex] = currentItemText;
    clearCurrentItem();
  }

  function deleteHandler(index) {
    listItems.splice(index, 1);
    clearCurrentItem();
  }
</script>

<h1 class="list-name">{listName}</h1>

<ul class="list">
  {#each listItems as item, index}
    <li class="list-item">
      <label>
        <div>
          <input type="checkbox" />
          {item}
        </div>
        <button
          class="edit-button"
          onclick={() => editHandler(index)}
          command="show-modal"
          commandfor="add-item-dialog">✏️</button
        >
      </label>
    </li>
  {/each}
</ul>

<button class="add-button" command="show-modal" commandfor="add-item-dialog"
  >✚</button
>

<dialog id="add-item-dialog" bind:this={dialog}>
  <input type="text" bind:value={currentItemText} placeholder="…" />
  <button onclick={clearCurrentItem}>Cancel</button>
  {#if currentItemIndex !== null}
    <button onclick={() => deleteHandler(currentItemIndex)}>Delete</button>
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
</style>
