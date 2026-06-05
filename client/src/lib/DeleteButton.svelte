<script>
  let { disabled, command, commandfor, onclick, type, children } = $props();
</script>

<button
  class="bg-blue-100 text-red-700 px-4 py-3 rounded-xl font-semibold min-w-12 disabled:op"
  {disabled}
  {command}
  {commandfor}
  {onclick}
  {type}
>
  {@render children?.()}
</button>
