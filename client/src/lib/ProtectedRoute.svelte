<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { fetchGet } from "../utils/fetchUtil.js";
  import { toast } from "@zerodevx/svelte-toast";

  let isAuthorized = false;
  let user = null;

  onMount(async () => {
    try {
      const response = await fetchGet("/authcheck");
      isAuthorized = true;
      user = response;
    } catch (error) {
      toast.push("Please sign in.");
      navigate("/", { replace: true });
    }
  });
</script>

{#if isAuthorized}
  <slot {user} />
{/if}
