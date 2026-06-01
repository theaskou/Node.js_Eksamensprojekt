<script>
  let { command, commandfor, onclick, children } = $props();
</script>

<div></div>

<button
  class="bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold min-w-12"
  {command}
  {commandfor}
  {onclick}
>
  {@render children?.()}
</button>
