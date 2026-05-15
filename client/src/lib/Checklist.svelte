<script>
  // funktion til at fetche checklist items

  const listName = "Indkøbsliste";
  let dialog;

  let listItems = $state(["Koriander", "Chili", "Tofu", "Risnudler"]);
  let currentItemText = $state(null);
  let currentItemIndex = $state(null);

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

<h1>{listName}</h1>

<ul>
  {#each listItems as item, index}
    <li>
      <label>
        <input type="checkbox" />
        <button
          onclick={() => editHandler(index)}
          command="show-modal"
          commandfor="add-item-dialog">✏️</button
        >
        {item}
      </label>
    </li>
  {/each}
</ul>

<button command="show-modal" commandfor="add-item-dialog">+</button>

<dialog id="add-item-dialog" bind:this={dialog}>
  <input type="text" bind:value={currentItemText} placeholder="…" />
  <button onclick={clearCurrentItem}>Cancel</button>
  {#if currentItemIndex !== null}
    <button onclick={() => deleteHandler(currentItemIndex)}>Delete</button>
    <button onclick={saveHandler}>Save</button>
  {:else}
    <button onclick={addHandler}>Add</button>
  {/if}
</dialog>
