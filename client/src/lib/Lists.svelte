<script>
  import { onMount } from "svelte";
  import { fetchGet } from "../utils/fetchUtil";
  import { useLocation } from "svelte-routing";
  import Avatar from "./Avatar.svelte";
  import { resolveColor } from "./config/colors.js";

  let { user } = $props();
  let userData = $state(null);
  let userLists = $state({});
  let resolvedColor = $derived(resolveColor(userData?.color));
  let memberAvatars = $state({});

  onMount(async () => {
    const userDataResult = await fetchGet(`/users/${user.userID}`);
    userData = userDataResult;

    const listsResult = await fetchGet(`/users/${user.userID}/lists`);
    userLists = listsResult.data;
  });
</script>

{#if userData}
  <Avatar avatar={userData.avatar} color={resolvedColor} />
  <div>Signed in as {userData.userName}</div>
{/if}

<!-- TODO: -->
<button>Create list</button>

<h1>Your lists:</h1>
<ul>
  {#each userLists as { listName, members }}
    <li>
      {listName}
      <div class="member-avatars">
        {#each members as member}
          <Avatar
            avatar={member.avatar}
            color={resolveColor(member.color)}
            size={30}
          />
        {/each}
      </div>
    </li>
  {/each}
</ul>
