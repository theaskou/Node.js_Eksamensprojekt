<script>
  import { onMount } from "svelte";
  import { fetchGet, fetchPost } from "../utils/fetchUtil";
  import { useLocation } from "svelte-routing";
  import Avatar from "./Avatar.svelte";
  import { resolveColor } from "./config/colors.js";
  import { navigate } from "svelte-routing";
  import logoutHandler from "../utils/logoutUtil";

  let { user } = $props();
  let userData = $state(null);
  let userLists = $state({});
  let resolvedColor = $derived(resolveColor(userData?.color));
  let memberAvatars = $state({});

  onMount(async () => {
    const userDataResult = await fetchGet("/users/me");
    userData = userDataResult;

    const listsResult = await fetchGet(`/users/${user.userID}/lists`);
    userLists = listsResult.data;
  });

</script>

{#if userData}
  <Avatar avatar={userData.avatar} color={resolvedColor} />
  <div>Signed in as {userData.userName}</div>
  <button onclick={logoutHandler}>Log out</button>
{/if}

<!-- TODO: -->
<button>Create list</button>

<h1>Your lists:</h1>
<ul>
  {#each userLists as { listID, listName, members }}
    <li>
      <button onclick={() => navigate(`/lists/${listID}`)}>
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
      </button>
    </li>
  {/each}
</ul>
