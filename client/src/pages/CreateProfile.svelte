<script>
  import { toast } from "@zerodevx/svelte-toast";
  import Button from "../lib/Button.svelte";
  import { fetchPost, fetchPut } from "../utils/fetchUtil";
  import { navigate } from "svelte-routing";

  let { user } = $props();
  let selectedAvatar = $state();
  let selectedColor = $state();

  async function saveHandler() {
    if (!selectedAvatar || !selectedColor) {
      toast.push("Please select a color and an avatar")
      return;
    }
    const result = await fetchPut(`/users/${user.userId}`, selectedAvatar, selectedColor);
    navigate
  }


</script>

<div class="container">
  <div>
    <div class="headlines">
      <h1>Hi {user.userName}!</h1>

      <h2>Pick a color and an avatar to get started:</h2>
    </div>

    <div class="profile-avatar-creator">
      <div class="color-picker">
        {#each colors as color}
          <button
            class="color-option"
            aria-label={color.name}
            style="background-color: {color.value}"
            onclick={() => {
              selectedColor = color;
            }}
          >
            {#if selectedColor === color}
              ✔
            {/if}
          </button>
        {/each}
      </div>

      <div class="avatar-picker">
        {#each avatars as avatar}
          <button
            class="avatar-option"
            disabled={!selectedColor}
            style="background-color: {selectedAvatar === avatar && selectedColor
              ? selectedColor.value
              : 'transparent'}"
            onclick={() => {
              selectedAvatar = avatar;
            }}
          >
            <img src={avatar.src} alt={avatar.name} />
          </button>
        {/each}
      </div>
    </div>
  </div>

  <Button onclick={saveHandler}>Save</Button>
</div>

<!-- <style>
  .container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .profile-avatar-creator {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .color-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }

  .color-option {
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
  }

  .avatar-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }

  .avatar-option {
    background: aliceblue;
    border: none;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    gap: 2px;
  }

  .avatar-option img {
    max-width: 100%;
    max-height: 100%;
  }

  .save-button {
    align-self: center;
  }
</style> -->
