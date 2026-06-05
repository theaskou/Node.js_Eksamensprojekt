<script>
  import { COLORS as colors } from "./config/colors.js";
  import { AVATARS as avatars } from "./config/avatars.js";

  let { setColor, setAvatar } = $props();
  let selectedAvatar = $state("");
  let selectedColor = $state("");
</script>

<div class="container">
  <div>
    <div class="headlines">
      <h2 class="font-semibold mb-4">Pick a color and an avatar:</h2>
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
              setColor(color.name);
            }}
          >
            {#if selectedColor.name === color.name}
              ✔
            {/if}
          </button>
        {/each}
      </div>

      <div class="avatar-picker">
        {#each avatars as avatar}
          <button
            class="disabled:opacity-20 avatar-option transition-opacity"
            disabled={!selectedColor}
            style="background-color: {selectedAvatar.name === avatar.name &&
            selectedColor
              ? selectedColor.value
              : 'transparent'}"
            onclick={() => {
              selectedAvatar = avatar;
              setAvatar(avatar.name);
            }}
          >
            <img src={avatar.src} alt={avatar.name} />
          </button>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
    width: 40px;
    height: 40px;
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
    border: none;
    border-radius: 50%;
    width: 66px;
    height: 66px;
    gap: 2px;
  }

  .avatar-option img {
    max-width: 100%;
    max-height: 100%;
  }
</style>
