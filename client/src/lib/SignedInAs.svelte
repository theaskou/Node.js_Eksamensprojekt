<script>
  import Avatar from "./Avatar.svelte";
  import { resolveColor } from "./config/colors";

  let { userName, avatar, color } = $props();
</script>

<div class="flex gap-4 items-center">
  <Avatar {avatar} color={resolveColor(color)} />
  <div>
    <div class="text-xs text-stone-500">Signed in as</div>
    <div>{userName}</div>
  </div>
</div>
