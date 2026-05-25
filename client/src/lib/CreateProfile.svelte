<!-- <script>
  const colors = [
    { name: "turquoise", value: "#1ABC9C" },
    { name: "light-blue", value: "#a2f4fd" },
    { name: "blue", value: "#3498DB" },
    { name: "purple", value: "#9B59B6" },
    { name: "dark-green", value: "#008A00" },
    { name: "green", value: "#27AE60" },
    { name: "cobalt", value: "#0050EF" },
    { name: "lime", value: "#7ccf00" },
    { name: "yellow", value: "#F1C40F" },
    { name: "orange", value: "#E67E22" },
    { name: "red", value: "#E74C3C" },
    { name: "dark-red", value: "#C0392B" },
  ];
  let selectedColor = null;

  const avatars = [
    { name: "blackbird", src: "/avatars/blackbird.png" },
    { name: "crow", src: "/avatars/crow.png" },
    { name: "duck", src: "/avatars/duck.png" },
    { name: "hummingbird", src: "/avatars/hummingbird.png" },
    { name: "kiwi", src: "/avatars/kiwi.png" },
    { name: "mallard", src: "/avatars/mallard.png" },
    { name: "robin", src: "/avatars/robin.png" },
    { name: "oriole", src: "/avatars/oriole.png" },
    { name: "sparrow", src: "/avatars/sparrow.png" },
    { name: "stork", src: "/avatars/stork.png" },
    { name: "tit", src: "/avatars/tit.png" },
    { name: "white-owl", src: "/avatars/white-owl.png" },
  ];
  let selectedAvatar = null;
</script>

<div class="container">
  <div>
    <div class="headlines">
      <h1>Hi [**name**]!</h1>

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

  <button class="save-button">Save</button>
</div>

<style>
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
