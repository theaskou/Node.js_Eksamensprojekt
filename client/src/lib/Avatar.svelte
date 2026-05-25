<script>
  let { avatar, color, size = 60 } = $props();
</script>

<div
  class="avatar"
  style="background-color: {color}; width: {size}px; height: {size}px;"
>
  <img src="/static/avatars/{avatar}.png" alt={avatar} />
</div>

<style>
  .avatar {
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .avatar img {
    max-width: 100%;
    max-height: 100%;
  }
</style>