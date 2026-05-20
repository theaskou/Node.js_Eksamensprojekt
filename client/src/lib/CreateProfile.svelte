<script>
  const colors = [
    { color: "turquoise", value: "#1ABC9C" },
    { color: "light Blue", value: "#a2f4fd" },
    { color: "blue", value: "#3498DB" },
    { color: "purple", value: "#9B59B6" },
    { color: "dark-green", value: "#008A00" },
    { color: "green", value: "#27AE60" },
    { color: "cobalt", value: "#0050EF" },
    { color: "lime", value: "#7ccf00" },
    { color: "yellow", value: "#F1C40F" },
    { color: "orange", value: "#E67E22" },
    { color: "red", value: "#E74C3C" },
    { color: "dark-red", value: "#C0392B" },
  ];
  let selectedColor = null;

  const avatars = [
    { name: "blackbird", src: "/avatars/blackbird.png" },
    { name: "crow", src: "/avatars/crow.png" },
    { name: "duck", src: "/avatars/duck.png" },
    { name: "hummingbird", src: "/avatars/hummingbird.png" },
    { name: "kiwi", src: "/avatars/kiwi.png" },
    { name: "mallard", src: "/avatars/mallard.png" },
    { name: "red-robin", src: "/avatars/robin1.png" },
    { name: "black-robin", src: "/avatars/robin2.png" },
    { name: "sparrow", src: "/avatars/sparrow.png" },
    { name: "stork", src: "/avatars/stork.png" },
    { name: "tit", src: "/avatars/tit.png" },
    { name: "white-owl", src: "/avatars/white-owl.png" },
  ];
  let selectedAvatar = null;
</script>

<div class="headlines">
  <h1>Hi [**name**]!</h1>

  <h2>Pick a color and an avatar to get started:</h2>
</div>

<div class="profile-avatar-creator">
  <div class="color-picker">
    {#each colors as color}
      <button
        class="color-option"
        aria-label={color.color}
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
          console.log(selectedAvatar);
        }}
      >
        <img src={avatar.src} alt={avatar.name} />
      </button>
    {/each}
  </div>

  <button class="save-button">Save</button>
</div>

<style>
  .headlines {
    margin: 12px;
    margin-bottom: 24px;
  }

  .profile-avatar-creator {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    min-height: 75vh;
    margin: 12px;
  }

  .color-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
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
</style>
