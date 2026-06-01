<script>
    let { clear, add, newListName, isEmpty, dialog } = $props();
</script>


<dialog bind:this={dialog}>
  <input
    type="text"
    bind:value={newListName}
    placeholder="Name your new list…"
  />
  <button onclick={clear}>Cancel</button>
  <button onclick={add} disabled={isEmpty}>Add</button>
</dialog> 


<!-- <dialog id="add-item-dialog" bind:this={dialog}>
  <input type="text" bind:value={currentItemText} placeholder="…" />
  <button onclick={clearCurrentItem}>Cancel</button>
  {#if currentItemIndex !== null}
    <button onclick={() => deleteHandler()}>Delete</button>
    <button onclick={saveHandler} disabled={isEmptyString}>Save</button>
  {:else}
    <button onclick={addHandler} disabled={isEmptyString}>Add</button>
  {/if}
</dialog>

-->