<script>
  import { onMount } from "svelte";
  import { fetchGet } from "../utils/fetchUtil";
  import { useLocation } from "svelte-routing";
  import Avatar from "./Avatar.svelte";
  import { resolveColor } from "../lib/config/avatars.js";

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

    const allIds = [];
    for (const members of Object.values(userLists)) {
      for (const id of members) {
        if (!allIds.includes(id)) {
          allIds.push(id);
        }
      }
    }

    const avatarResults = await fetchGet(
      `/users/avatars?ids=${allIds.join(",")}`,
    );

    memberAvatars = {};
    for (const member of avatarResults) {
      memberAvatars[member.id] = member;
    }
  });
</script>

{#if userData}
  <Avatar avatar={userData.avatar} color={resolvedColor} />
  <div>Signed in as {userData.userName}</div>
{/if}

<h1>Your lists:</h1>
<ul>
  {#each Object.entries(userLists) as [listName, members]}
    <li>
      {listName}
      <div class="member-avatars">
        {#each members as memberId}
          {#if memberAvatars[memberId]}
            <Avatar
              avatar={memberAvatars[memberId].avatar}
              color={resolveColor(memberAvatars[memberId].color)}
              size={30}
            />
          {/if}
        {/each}
      </div>
    </li>
  {/each}
</ul>