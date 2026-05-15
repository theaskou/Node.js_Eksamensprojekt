<script>
  // funktion til at fetche checklist items

  const listName = "Indkøbsliste";
  let dialog;

  let listItems = ["Koriander", "Chili", "Tofu", "Risnudler"];
  let currentItemText = null;
  let currentItemIndex = null;

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
    listItems = listItems;
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
          on:click={() => editHandler(index)}
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
  <button on:click={clearCurrentItem}>Cancel</button>
  {#if currentItemIndex !== null}
    <button on:click={saveHandler}>Save</button>
    <button on:click={() => deleteHandler(currentItemIndex)}>Delete</button>
  {:else}
    <button on:click={addHandler}>Add</button>
  {/if}
</dialog>
