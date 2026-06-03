<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { fetchPost } from "../utils/fetchUtil";
  import { toast } from "@zerodevx/svelte-toast";

  async function verify() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    const token = urlParams.get("token");
    const response = await fetchPost(`/users/${userId}/verify/${token}`);
    if (response.error) {
      toast.push(`${response.error}`);

      navigate("/");
    } else {
      toast.push(`${response.message}`);
      setTimeout(() => navigate(`/lists`), 2000);
    }
  }

  onMount(() => {
    verify();
  });
</script>

<h1 class="font-semibold text-2xl ml-5 mt-4 mb-4">Verifying your email…</h1>

<h2 class="ml-5 font-semibold">You will be redirected.</h2>

<a href="/lists" class="text-blue-700 ml-5"
  >Click here, if you are not redirected.</a
>
