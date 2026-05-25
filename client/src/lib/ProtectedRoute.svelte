<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { fetchGet } from "../utils/fetchUtil.js";
  import { toast } from "@zerodevx/svelte-toast";

  let isAuthorized = false;
  let user = null;

  onMount(async () => {
    const response = await fetchGet("/authcheck");
    if (response.error) {
      toast.push(`⛔️ ${response.error}`);
      navigate("/", { replace: true });
    } else {
      isAuthorized = true;
      user = response;
    }
  });
</script>

{#if isAuthorized}
  <slot {user} />
{/if}
